// Función para realizar análisis local de texto sin depender de APIs externas
export async function performLocalAnalysis(subject: string, descriptions: string[]) {
  try {
    // Unir todas las descripciones en un solo texto
    const allText = descriptions.join(" ").toLowerCase()

    // Análisis básico de frecuencia de palabras
    const words = allText.match(/\b\w+\b/g) || []
    const wordFrequency: Record<string, number> = {}

    // Palabras a ignorar (stopwords en español)
    const stopwords = new Set([
      "a",
      "al",
      "con",
      "de",
      "del",
      "el",
      "en",
      "es",
      "la",
      "las",
      "lo",
      "los",
      "para",
      "por",
      "que",
      "se",
      "un",
      "una",
      "y",
      "o",
      "mi",
      "su",
      "sus",
      "tu",
      "tus",
    ])

    // Contar frecuencia de palabras
    words.forEach((word) => {
      if (word.length > 3 && !stopwords.has(word)) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1
      }
    })

    // Ordenar palabras por frecuencia
    const sortedWords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)

    // Identificar posibles temas basados en palabras frecuentes
    const topics = sortedWords.slice(0, 8).map(([word]) => word)

    // Buscar frases comunes (n-gramas)
    const phrases: string[] = []
    for (const desc of descriptions) {
      const sentences = desc.split(/[.!?]+/).filter((s) => s.trim().length > 10)
      for (const sentence of sentences) {
        if (topics.some((topic) => sentence.toLowerCase().includes(topic))) {
          phrases.push(sentence.trim())
        }
      }
    }

    // Seleccionar frases únicas (eliminar duplicados o muy similares)
    const uniquePhrases = Array.from(new Set(phrases)).slice(0, 10)

    // Generar problemas comunes basados en frases
    const problems = uniquePhrases
      .filter(
        (phrase) =>
          phrase.includes("problema") ||
          phrase.includes("dificultad") ||
          phrase.includes("duda") ||
          phrase.includes("no entiende") ||
          phrase.includes("confusión"),
      )
      .slice(0, 5)

    // Generar recomendaciones básicas
    const recommendations = [
      `Reforzar explicaciones sobre: ${topics.slice(0, 3).join(", ")}`,
      `Crear material de apoyo para los temas más frecuentes`,
      `Considerar sesiones grupales sobre temas recurrentes`,
      `Revisar metodología de enseñanza para los conceptos más problemáticos`,
    ]

    // Generar resumen
    const summary = `El análisis de ${descriptions.length} atenciones en la materia "${subject}" 
      muestra que los temas más frecuentes son: ${topics.slice(0, 5).join(", ")}. 
      Se identificaron ${problems.length} problemas comunes y se sugieren ${recommendations.length} recomendaciones.`

    return {
      commonProblems: problems.length > 0 ? problems : [`Dificultades con conceptos de ${subject}`],
      recurringTopics: topics,
      summary,
      recommendations,
    }
  } catch (error) {
    console.error("Error en análisis local:", error)
    return {
      commonProblems: ["Error al analizar los datos"],
      recurringTopics: [],
      summary: "No se pudo completar el análisis local de los datos.",
      recommendations: ["Intentar con un conjunto de datos más pequeño"],
    }
  }
}
