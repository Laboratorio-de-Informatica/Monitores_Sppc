"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Attendance {
  id: string
  person_name: string
  person_id: string
  subject: string
  description: string
  created_at: string
  session_id: string
}

interface UserAttendancesProps {
  userId: string
}

export default function UserAttendances({ userId }: UserAttendancesProps) {
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/attendances?userId=${userId}`)
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

    if (userId) {
      fetchAttendances()
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
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (attendances.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No hay atenciones registradas para este usuario
        </CardContent>
      </Card>
    )
  }

  // Agrupar atenciones por fecha
  const attendancesByDate: Record<string, Attendance[]> = {}

  attendances.forEach((attendance) => {
    const date = format(new Date(attendance.created_at), "yyyy-MM-dd")
    if (!attendancesByDate[date]) {
      attendancesByDate[date] = []
    }
    attendancesByDate[date].push(attendance)
  })

  return (
    <Accordion type="single" collapsible className="w-full">
      {Object.entries(attendancesByDate).map(([date, dateAttendances]) => {
        const formattedDate = format(new Date(date), "dd MMMM yyyy", { locale: es })

        return (
          <AccordionItem key={date} value={date}>
            <AccordionTrigger className="hover:bg-gray-50 px-4">
              <div className="flex justify-between w-full">
                <span>{formattedDate}</span>
                <span className="text-gray-500 text-sm">{dateAttendances.length} atenciones</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 p-4">
                {dateAttendances.map((attendance) => {
                  const createdAt = new Date(attendance.created_at)
                  const formattedTime = format(createdAt, "HH:mm:ss", { locale: es })

                  return (
                    <Card key={attendance.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between mb-2">
                          <h3 className="font-semibold">{attendance.person_name}</h3>
                          <span className="text-sm text-gray-500">{formattedTime}</span>
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
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
