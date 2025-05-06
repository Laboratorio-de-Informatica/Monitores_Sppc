import { requireAuth } from "@/lib/utils/auth"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import DashboardHeader from "./dashboard-header"
import AttendanceForm from "./attendance-form"
import AttendanceList from "./attendance-list"
import PunctualityInfo from "./punctuality-info"
import { db } from "@/lib/db"
import { sessions } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export default async function DashboardPage() {
  const session = await requireAuth()

  // Obtener datos de la sesión actual
  const currentSession = await db.query.sessions.findFirst({
    where: eq(sessions.id, session.id),
  })

  if (!currentSession) {
    redirect("/login")
  }

  // Formatear la hora de inicio de sesión
  const loginTime = new Date(currentSession.login_time)
  const formattedLoginTime = format(loginTime, "dd MMMM yyyy, HH:mm:ss", { locale: es })

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader username={session.user.username} loginTime={formattedLoginTime} sessionId={session.id} />

      <main className="container mx-auto py-6 px-4">
        {currentSession.scheduled_start_time && (
          <div className="mb-6">
            <PunctualityInfo
              scheduledTime={currentSession.scheduled_start_time}
              loginTime={loginTime}
              punctualityMinutes={currentSession.punctuality_minutes}
              scheduledEndTime={
                session.user.scheduledEndTime
                  ? new Date(`${format(new Date(), "yyyy-MM-dd")}T${session.user.scheduledEndTime}`)
                  : null
              }
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Registrar Nueva Atención</h2>
              <AttendanceForm sessionId={session.id} userId={session.user_id} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Atenciones en esta Sesión</h2>
              <AttendanceList sessionId={session.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
