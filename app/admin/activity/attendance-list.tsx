import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"

interface AttendanceListProps {
    attendances: Array<{
        id: string
        person_name: string
        person_id: string
        subject: string
        description: string
        created_at: string
    }>
}

export default function AttendanceList({ attendances }: AttendanceListProps) {
    if (attendances.length === 0) {
        return (
            <Card>
                <CardContent className="p-6 text-center text-gray-500">
                    No hay atenciones registradas para el período seleccionado
                </CardContent>
            </Card>
        )
    }

    // Agrupar atenciones por fecha
    const attendancesByDate: Record<string, any[]> = {}

    attendances.forEach((attendance) => {
        const date = format(new Date(attendance.created_at), "yyyy-MM-dd")
        if (!attendancesByDate[date]) {
            attendancesByDate[date] = []
        }
        attendancesByDate[date].push(attendance)
    })

    return (
        <div className="space-y-6">
            {Object.entries(attendancesByDate).map(([date, dateAttendances]) => {
                const formattedDate = format(new Date(date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })

                return (
                    <div key={date} className="space-y-2">
                        <h3 className="font-medium text-gray-700 capitalize">{formattedDate}</h3>
                        <div className="space-y-2">
                            {dateAttendances.map((attendance) => {
                                const createdAt = new Date(attendance.created_at)
                                const formattedTime = format(createdAt, "HH:mm:ss", { locale: es })

                                return (
                                    <Card key={attendance.id}>
                                        <CardContent className="p-4">
                                            <div className="flex flex-col md:flex-row justify-between mb-2">
                                                <div className="flex items-center">
                                                    <h4 className="font-semibold">{attendance.person_name}</h4>
                                                    <Badge variant="outline" className="ml-2">
                                                        ID: {attendance.person_id}
                                                    </Badge>
                                                </div>
                                                <span className="text-sm text-gray-500">{formattedTime}</span>
                                            </div>

                                            <div className="mb-2">
                                                <Badge variant="secondary">{attendance.subject}</Badge>
                                            </div>

                                            <p className="text-gray-700 whitespace-pre-wrap text-sm">{attendance.description}</p>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
