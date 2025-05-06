"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Clock, LogIn, LogOut } from "lucide-react"

interface Session {
  id: string
  login_time: string
  logout_time: string | null
  is_active: boolean
}

interface UserSessionsProps {
  userId: string
}

export default function UserSessions({ userId }: UserSessionsProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/sessions?userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          setSessions(data)
        }
      } catch (error) {
        console.error("Error fetching sessions:", error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchSessions()
    }
  }, [userId])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No hay sesiones registradas para este usuario
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => {
        const loginTime = new Date(session.login_time)
        const formattedLoginTime = format(loginTime, "dd MMMM yyyy, HH:mm:ss", { locale: es })

        let duration = "Sesión activa"
        let formattedLogoutTime = "Activa"

        if (session.logout_time) {
          const logoutTime = new Date(session.logout_time)
          formattedLogoutTime = format(logoutTime, "dd MMMM yyyy, HH:mm:ss", { locale: es })

          // Calcular duración
          const durationMs = logoutTime.getTime() - loginTime.getTime()
          const durationMinutes = Math.floor(durationMs / 60000)
          const durationHours = Math.floor(durationMinutes / 60)
          const remainingMinutes = durationMinutes % 60

          duration = `${durationHours}h ${remainingMinutes}m`
        }

        return (
          <Card key={session.id} className={session.is_active ? "border-green-300" : ""}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <Badge variant={session.is_active ? "default" : "secondary"} className="mr-2">
                    {session.is_active ? "Activa" : "Finalizada"}
                  </Badge>
                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm text-gray-500">{duration}</span>
                </div>
                <span className="text-xs text-gray-500">ID: {session.id}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center">
                  <LogIn className="h-4 w-4 mr-2 text-green-500" />
                  <div>
                    <div className="text-xs text-gray-500">Inicio de sesión</div>
                    <div className="font-medium">{formattedLoginTime}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <LogOut className="h-4 w-4 mr-2 text-red-500" />
                  <div>
                    <div className="text-xs text-gray-500">Cierre de sesión</div>
                    <div className="font-medium">{formattedLogoutTime}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
