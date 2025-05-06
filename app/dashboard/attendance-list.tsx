"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Attendance } from "@/lib/db/schema"

interface AttendanceListProps {
  sessionId: string
  isAdmin?: boolean
}

export default function AttendanceList({ sessionId, isAdmin = false }: AttendanceListProps) {
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)
  const [eventSource, setEventSource] = useState<EventSource | null>(null)

  useEffect(() => {
    // Cargar atenciones iniciales
    const fetchAttendances = async () => {
      try {
        const response = await fetch(`/api/attendances?sessionId=${sessionId}`)
        if (response.ok) {
          const data = await response.json()
          setAttendances(data)
        }
      } catch (error) {
        console.error("Error fetching attendances:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAttendances()

    // Configurar SSE para actualizaciones en tiempo real
    const lastEventId = Date.now().toString()
    const sse = new EventSource(`/api/sse/attendances?sessionId=${sessionId}&lastEventId=${lastEventId}`)

    sse.onmessage = (event) => {
      if (event.data) {
        try {
          const newAttendances = JSON.parse(event.data)
          if (Array.isArray(newAttendances) && newAttendances.length > 0) {
            setAttendances((current) => {
              // Combinar y eliminar duplicados
              const combined = [...newAttendances, ...current]
              const uniqueIds = new Set()
              return combined.filter((item) => {
                if (uniqueIds.has(item.id)) return false
                uniqueIds.add(item.id)
                return true
              })
            })
          }
        } catch (error) {
          console.error("Error parsing SSE data:", error)
        }
      }
    }

    sse.onerror = (error) => {
      console.error("SSE error:", error)
      sse.close()
    }

    setEventSource(sse)

    return () => {
      sse.close()
    }
  }, [sessionId, isAdmin])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (attendances.length === 0) {
    return <div className="text-center py-8 text-gray-500">No hay atenciones registradas en esta sesión</div>
  }

  return (
    <div className="space-y-4">
      {attendances.map((attendance) => {
        const createdAt = new Date(attendance.created_at)
        const formattedDate = format(createdAt, "dd MMMM yyyy, HH:mm:ss", { locale: es })

        return (
          <Card key={attendance.id}>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row justify-between mb-2">
                <h3 className="font-semibold">{attendance.person_name}</h3>
                <span className="text-sm text-gray-500">{formattedDate}</span>
              </div>

              <div className="flex flex-wrap gap-x-4 text-sm text-gray-600 mb-2">
                <span>ID: {attendance.person_id}</span>
                <span>Materia: {attendance.subject}</span>
              </div>

              <p className="text-gray-700 whitespace-pre-wrap">{attendance.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
