import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/utils/auth"
import { performLocalAnalysis } from "./local-analysis"

export async function POST(request: NextRequest) {
  try {
    // Verificar si el usuario es administrador
    const session = await getSession()
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { subject, descriptions } = await request.json()

    if (!subject || !descriptions || !descriptions.length) {
      return NextResponse.json({ error: "Datos insuficientes para el análisis" }, { status: 400 })
    }

    // Primero intentamos con análisis local que es más rápido y no depende de servicios externos
    const localAnalysis = await performLocalAnalysis(subject, descriptions)

    // Si tenemos suficientes problemas identificados, usamos el análisis local
    if (localAnalysis.commonProblems.length >= 3) {
      return NextResponse.json(localAnalysis)
    }

    // Si el análisis local no fue suficiente, intentamos con un modelo open source
    try {
      // Preparar el prompt para la IA
      const prompt = `
        Analiza las siguientes descripciones de atenciones académicas para la materia "${subject}".
        Identifica los problemas más comunes, temas recurrentes, y proporciona recomendaciones para mejorar.
        
        Descripciones:
        ${descriptions.slice(0, 5).join("\n\n")}
        
        Formato de respuesta:
        Problemas comunes:
        - Problema 1
        - Problema 2
        
        Temas recurrentes:
        - Tema 1
        - Tema 2
        
        Resumen:
        [Resumen conciso]
        
        Recomendaciones:
        - Recomendación 1
        - Recomendación 2
      `

      // Usar un modelo más ligero y open source
      const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 500,
            temperature: 0.7,
          },
        }),
        signal: AbortSignal.timeout(8000), // 8 segundos de timeout
      })

      if (!response.ok) {
        throw new Error(`Error en la API: ${response.statusText}`)
      }

      const result = await response.json()
      let generatedText = ""

      if (Array.isArray(result)) {
        generatedText = result[0]?.generated_text || ""
      } else if (typeof result === "object" && result.generated_text) {
        generatedText = result.generated_text
      } else {
        generatedText = String(result)
      }

      // Procesar el texto generado para extraer las secciones
      const sections: Record<string, string[]> = {
        commonProblems: [],
        recurringTopics: [],
        recommendations: [],
      }

      let currentSection = ""
      const lines = generatedText.split("\n")

      for (const line of lines) {
        const trimmedLine = line.trim()

        if (trimmedLine.toLowerCase().includes("problemas comunes")) {
          currentSection = "commonProblems"
          continue
        } else if (trimmedLine.toLowerCase().includes("temas recurrentes")) {
          currentSection = "recurringTopics"
          continue
        } else if (trimmedLine.toLowerCase().includes("resumen")) {
          currentSection = "summary"
          continue
        } else if (trimmedLine.toLowerCase().includes("recomendaciones")) {
          currentSection = "recommendations"
          continue
        }

        if (currentSection && trimmedLine.startsWith("-")) {
          const content = trimmedLine.substring(1).trim()
          if (content && currentSection !== "summary") {
            sections[currentSection].push(content)
          } else if (content && currentSection === "summary") {
            sections.summary = content
          }
        }
      }

      // Combinar resultados del análisis local y del modelo
      const combinedAnalysis = {
        commonProblems: [...new Set([...sections.commonProblems, ...localAnalysis.commonProblems])].slice(0, 5),
        recurringTopics: [...new Set([...sections.recurringTopics, ...localAnalysis.recurringTopics])].slice(0, 8),
        summary: sections.summary || localAnalysis.summary,
        recommendations: [...new Set([...sections.recommendations, ...localAnalysis.recommendations])].slice(0, 5),
      }

      return NextResponse.json(combinedAnalysis)
    } catch (error) {
      console.error("Error con el modelo externo, usando solo análisis local:", error)
      return NextResponse.json(localAnalysis)
    }
  } catch (error) {
    console.error("Error en el análisis de IA:", error)
    return NextResponse.json(
      {
        commonProblems: ["Error al procesar el análisis"],
        recurringTopics: [],
        summary: "Ocurrió un error al procesar las descripciones.",
        recommendations: ["Intentar nuevamente con menos datos"],
      },
      { status: 200 },
    )
  }
}
