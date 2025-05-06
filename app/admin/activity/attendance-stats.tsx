import { Card, CardContent } from "@/components/ui/card"
import { Clock, Users, BookOpen, Calendar } from "lucide-react"

interface AttendanceStatsProps {
    stats: {
        totalAttendances: number
        totalStudents: number
        averageAttendancesPerDay: number
        totalSessionTime: number
        subjectStats: Array<{ name: string; count: number }>
    }
}

export default function AttendanceStats({ stats }: AttendanceStatsProps) {
    // Convertir tiempo total de sesión (en minutos) a formato legible
    const formatSessionTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return `${hours}h ${mins}m`
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
                <CardContent className="p-4 flex items-center">
                    <Users className="h-8 w-8 text-blue-500 mr-4" />
                    <div>
                        <p className="text-sm text-gray-500">Total Estudiantes</p>
                        <h3 className="text-2xl font-bold">{stats.totalStudents}</h3>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4 flex items-center">
                    <Calendar className="h-8 w-8 text-green-500 mr-4" />
                    <div>
                        <p className="text-sm text-gray-500">Total Atenciones</p>
                        <h3 className="text-2xl font-bold">{stats.totalAttendances}</h3>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4 flex items-center">
                    <BookOpen className="h-8 w-8 text-amber-500 mr-4" />
                    <div>
                        <p className="text-sm text-gray-500">Promedio Diario</p>
                        <h3 className="text-2xl font-bold">{stats.averageAttendancesPerDay.toFixed(1)}</h3>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4 flex items-center">
                    <Clock className="h-8 w-8 text-purple-500 mr-4" />
                    <div>
                        <p className="text-sm text-gray-500">Tiempo Total</p>
                        <h3 className="text-2xl font-bold">{formatSessionTime(stats.totalSessionTime)}</h3>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
