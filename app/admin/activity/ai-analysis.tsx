"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Brain, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AIAnalysisProps {
    attendances: any[]
    isLoading: boolean
}

export default function AIAnalysis({ attendances, isLoading }: AIAnalysisProps) {
    const [analyzing, setAnalyzing] = useState(false)
    const [analysis, setAnalysis] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [analysisMethod, setAnalysisMethod] = useState<string>("local") // "local" o "api"

    const runAnalysis = async () => {
        if (!attendances.length) return

        setAnalyzing(true)
        setError(null)

        try {
            // Agrupar atenciones por materia
            const attendancesBySubject: Record<string, any[]> = {}
            attendances.forEach((attendance) => {
                if (!attendancesBySubject[attendance.subject]) {
                    attendancesBySubject[attendance.subject] = []
                }
                attendancesBySubject[attendance.subject].push(attendance)
            })

            // Enviar cada grupo de materia para análisis
            const analysisResults: Record<string, any> = {}

            for (const [subject, subjectAttendances] of Object.entries(attendancesBySubject)) {
                const descriptions = subjectAttendances.map((a) => a.description)

                const response = await fetch("/api/admin/ai-analysis", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        subject,
                        descriptions,
                    }),
                })

                if (!response.ok) {
                    throw new Error(`Error al analizar la materia ${subject}`)
                }

                const result = await response.json()
                analysisResults[subject] = result
            }

            setAnalysis(analysisResults)
            setAnalysisMethod(
                Object.values(analysisResults).some(
                    (result) => result.commonProblems.length > 3 || result.recommendations.length > 3,
                )
                    ? "api"
                    : "local",
            )
        } catch (error) {
            console.error("Error en análisis de IA:", error)
            setError("Ocurrió un error al realizar el análisis. Por favor, intenta nuevamente.")
        } finally {
            setAnalyzing(false)
        }
    }

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6 flex justify-center items-center min-h-[200px]">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-500">Cargando datos...</span>
                </CardContent>
            </Card>
        )
    }

    if (!attendances.length) {
        return (
            <Card>
                <CardContent className="p-6 text-center text-gray-500">No hay atenciones disponibles para analizar</CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-semibold">Análisis de Atenciones por Materia</h3>
                        <p className="text-sm text-gray-500">
                            Analiza las descripciones de las atenciones para identificar problemas comunes por materia
                        </p>
                    </div>
                    <Button onClick={runAnalysis} disabled={analyzing || !attendances.length} className="flex items-center">
                        {analyzing ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Analizando...
                            </>
                        ) : (
                            <>
                                <Brain className="h-4 w-4 mr-2" />
                                Analizar Atenciones
                            </>
                        )}
                    </Button>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {analysis && (
                    <>
                        {analysisMethod === "local" && (
                            <Alert className="mb-4">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                <AlertDescription>
                                    Se está utilizando un análisis local básico. Los resultados son aproximados y basados en frecuencia de
                                    palabras.
                                </AlertDescription>
                            </Alert>
                        )}

                        <Tabs defaultValue={Object.keys(analysis)[0]}>
                            <TabsList className="mb-4 flex flex-wrap">
                                {Object.keys(analysis).map((subject) => (
                                    <TabsTrigger key={subject} value={subject} className="mb-1">
                                        {subject}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {Object.entries(analysis).map(([subject, result]: [string, any]) => (
                                <TabsContent key={subject} value={subject}>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium mb-2">Problemas Comunes</h4>
                                            {result.commonProblems && result.commonProblems.length > 0 ? (
                                                <ul className="list-disc pl-5 space-y-2">
                                                    {result.commonProblems.map((problem: string, index: number) => (
                                                        <li key={index} className="text-gray-700">
                                                            {problem}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-gray-500 italic">No se identificaron problemas específicos</p>
                                            )}
                                        </div>

                                        <div>
                                            <h4 className="font-medium mb-2">Temas Recurrentes</h4>
                                            {result.recurringTopics && result.recurringTopics.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {result.recurringTopics.map((topic: string, index: number) => (
                                                        <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                                                            {topic}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 italic">No se identificaron temas recurrentes</p>
                                            )}
                                        </div>

                                        <div>
                                            <h4 className="font-medium mb-2">Resumen</h4>
                                            <p className="text-gray-700">{result.summary || "No hay resumen disponible"}</p>
                                        </div>

                                        <div>
                                            <h4 className="font-medium mb-2">Recomendaciones</h4>
                                            {result.recommendations && result.recommendations.length > 0 ? (
                                                <ul className="list-disc pl-5 space-y-2">
                                                    {result.recommendations.map((recommendation: string, index: number) => (
                                                        <li key={index} className="text-gray-700">
                                                            {recommendation}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-gray-500 italic">No hay recomendaciones disponibles</p>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
