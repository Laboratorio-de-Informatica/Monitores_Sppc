"use client"

import { useState, useEffect } from "react"
import type { User } from "@/lib/db/schema"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePicker } from "@/components/ui/date-picker"
import { Loader2, FileText, FileSpreadsheet, FileIcon as FilePdf } from "lucide-react"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"
import AttendanceStats from "./attendance-stats"
import AttendanceList from "./attendance-list"
import { generatePdf, generateExcel, generateWord } from "./export-utils"
// Importar el componente de análisis de IA
import AIAnalysis from "./ai-analysis"

interface ActivityReportProps {
    monitors: User[]
}

export default function ActivityReport({ monitors }: ActivityReportProps) {
    const [selectedMonitorId, setSelectedMonitorId] = useState<string>("")
    const [periodType, setPeriodType] = useState<string>("week")
    const [startDate, setStartDate] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }))
    const [endDate, setEndDate] = useState<Date>(endOfWeek(new Date(), { weekStartsOn: 1 }))
    const [loading, setLoading] = useState<boolean>(false)
    const [attendances, setAttendances] = useState<any[]>([])
    const [stats, setStats] = useState<any>(null)
    const [exportLoading, setExportLoading] = useState<Record<string, boolean>>({})

    // Actualizar fechas cuando cambia el tipo de período
    useEffect(() => {
        const today = new Date()

        switch (periodType) {
            case "day":
                setStartDate(today)
                setEndDate(today)
                break
            case "week":
                setStartDate(startOfWeek(today, { weekStartsOn: 1 }))
                setEndDate(endOfWeek(today, { weekStartsOn: 1 }))
                break
            case "month":
                setStartDate(startOfMonth(today))
                setEndDate(endOfMonth(today))
                break
            case "custom":
                // Mantener las fechas actuales para el período personalizado
                break
        }
    }, [periodType])

    // Cargar datos cuando cambia el monitor o las fechas
    useEffect(() => {
        if (selectedMonitorId) {
            fetchData()
        }
    }, [selectedMonitorId, startDate, endDate])

    const fetchData = async () => {
        if (!selectedMonitorId || !startDate || !endDate) return

        setLoading(true)
        try {
            const formattedStartDate = format(startDate, "yyyy-MM-dd")
            const formattedEndDate = format(endDate, "yyyy-MM-dd")

            const response = await fetch(
                `/api/admin/activity?userId=${selectedMonitorId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
            )

            if (response.ok) {
                const data = await response.json()
                setAttendances(data.attendances)
                setStats(data.stats)
            }
        } catch (error) {
            console.error("Error fetching activity data:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleExport = async (type: string) => {
        if (!attendances.length || !stats) return

        setExportLoading((prev) => ({ ...prev, [type]: true }))

        try {
            const selectedMonitor = monitors.find((m) => m.id === selectedMonitorId)
            const reportTitle = `Reporte de Actividad - ${selectedMonitor?.username || "Monitor"}`
            const periodText = `Período: ${format(startDate, "dd/MM/yyyy")} - ${format(endDate, "dd/MM/yyyy")}`

            switch (type) {
                case "pdf":
                    await generatePdf(reportTitle, periodText, attendances, stats)
                    break
                case "excel":
                    await generateExcel(reportTitle, periodText, attendances, stats)
                    break
                case "word":
                    await generateWord(reportTitle, periodText, attendances, stats)
                    break
            }
        } catch (error) {
            console.error(`Error exporting to ${type}:`, error)
        } finally {
            setExportLoading((prev) => ({ ...prev, [type]: false }))
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="monitor-select">Seleccionar Monitor</Label>
                            <Select value={selectedMonitorId} onValueChange={setSelectedMonitorId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un monitor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {monitors.map((monitor) => (
                                        <SelectItem key={monitor.id} value={monitor.id}>
                                            {monitor.username}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Período</Label>
                            <Select value={periodType} onValueChange={setPeriodType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un período" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="day">Día</SelectItem>
                                    <SelectItem value="week">Semana</SelectItem>
                                    <SelectItem value="month">Mes</SelectItem>
                                    <SelectItem value="custom">Personalizado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {periodType === "custom" && (
                            <>
                                <div className="space-y-2">
                                    <Label>Fecha Inicio</Label>
                                    <DatePicker date={startDate} setDate={setStartDate} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Fecha Fin</Label>
                                    <DatePicker date={endDate} setDate={setEndDate} />
                                </div>
                            </>
                        )}
                    </div>

                    {selectedMonitorId && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center"
                                onClick={() => handleExport("pdf")}
                                disabled={loading || !attendances.length || exportLoading.pdf}
                            >
                                {exportLoading.pdf ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <FilePdf className="h-4 w-4 mr-2 text-red-500" />
                                )}
                                Exportar PDF
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center"
                                onClick={() => handleExport("excel")}
                                disabled={loading || !attendances.length || exportLoading.excel}
                            >
                                {exportLoading.excel ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <FileSpreadsheet className="h-4 w-4 mr-2 text-green-500" />
                                )}
                                Exportar Excel
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center"
                                onClick={() => handleExport("word")}
                                disabled={loading || !attendances.length || exportLoading.word}
                            >
                                {exportLoading.word ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <FileText className="h-4 w-4 mr-2 text-blue-500" />
                                )}
                                Exportar Word
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {selectedMonitorId && (
                <div className="space-y-6">
                    {loading ? (
                        <Card>
                            <CardContent className="p-6 flex justify-center items-center min-h-[200px]">
                                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                <span className="ml-2 text-gray-500">Cargando datos...</span>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            {stats && <AttendanceStats stats={stats} />}

                            <Tabs defaultValue="list">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="list">Lista de Atenciones</TabsTrigger>
                                    <TabsTrigger value="subjects">Materias Atendidas</TabsTrigger>
                                    <TabsTrigger value="ai-analysis">Análisis de IA</TabsTrigger>
                                </TabsList>
                                <TabsContent value="list">
                                    <AttendanceList attendances={attendances} />
                                </TabsContent>
                                <TabsContent value="subjects">
                                    <Card>
                                        <CardContent className="p-6">
                                            {stats?.subjectStats?.length > 0 ? (
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold">Materias Atendidas</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {stats.subjectStats.map((subject: any) => (
                                                            <Card key={subject.name}>
                                                                <CardContent className="p-4">
                                                                    <div className="font-medium">{subject.name}</div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {subject.count} {subject.count === 1 ? "atención" : "atenciones"}
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    No hay datos de materias para el período seleccionado
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="ai-analysis">
                                    <AIAnalysis attendances={attendances} isLoading={loading} />
                                </TabsContent>
                            </Tabs>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
