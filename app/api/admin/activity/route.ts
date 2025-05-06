import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getSession } from "@/lib/utils/auth"
import { attendances, sessions } from "@/lib/db/schema"
import { and, eq, gte, lte } from "drizzle-orm"
import { differenceInMinutes, differenceInDays } from "date-fns"

export async function GET(request: NextRequest) {
    try {
        // Verificar si el usuario es administrador
        const session = await getSession()
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        const startDate = searchParams.get("startDate")
        const endDate = searchParams.get("endDate")

        if (!userId || !startDate || !endDate) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
        }

        // Convertir fechas a objetos Date
        const startDateTime = new Date(`${startDate}T00:00:00`)
        const endDateTime = new Date(`${endDate}T23:59:59`)

        // Obtener atenciones del usuario en el rango de fechas
        const attendancesList = await db.query.attendances.findMany({
            where: and(
                eq(attendances.user_id, userId),
                gte(attendances.created_at, startDateTime),
                lte(attendances.created_at, endDateTime),
            ),
            orderBy: (attendances, { desc }) => [desc(attendances.created_at)],
        })

        // Obtener sesiones del usuario en el rango de fechas
        const sessionsList = await db.query.sessions.findMany({
            where: and(
                eq(sessions.user_id, userId),
                gte(sessions.login_time, startDateTime),
                lte(sessions.login_time, endDateTime),
            ),
        })

        // Calcular estadísticas
        const uniqueStudentIds = new Set(attendancesList.map((a) => a.person_id))

        // Calcular tiempo total de sesión en minutos
        let totalSessionTime = 0
        sessionsList.forEach((s) => {
            const loginTime = new Date(s.login_time)
            const logoutTime = s.logout_time ? new Date(s.logout_time) : new Date()
            totalSessionTime += differenceInMinutes(logoutTime, loginTime)
        })

        // Calcular estadísticas por materia
        const subjectCounts: Record<string, number> = {}
        attendancesList.forEach((a) => {
            const subject = a.subject
            subjectCounts[subject] = (subjectCounts[subject] || 0) + 1
        })

        const subjectStats = Object.entries(subjectCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)

        // Calcular promedio diario de atenciones
        const daysDiff = Math.max(1, differenceInDays(endDateTime, startDateTime) + 1)
        const averageAttendancesPerDay = attendancesList.length / daysDiff

        // Preparar respuesta
        const stats = {
            totalAttendances: attendancesList.length,
            totalStudents: uniqueStudentIds.size,
            averageAttendancesPerDay,
            totalSessionTime,
            subjectStats,
        }

        return NextResponse.json({
            attendances: attendancesList,
            stats,
        })
    } catch (error) {
        console.error("Error fetching activity data:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
