"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { sessions, attendances } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"

export async function logout(sessionId: string) {
  try {
    const now = new Date()

    // Actualizar la sesión con la hora de cierre
    await db.update(sessions).set({ logout_time: now, is_active: false }).where(eq(sessions.id, sessionId))

    // Eliminar la cookie de sesión
    const cookieStore = await cookies()
    cookieStore.delete("session_id")
  } catch (error) {
    console.error("Error en logout:", error)
  }
}

export async function createAttendance(
  sessionId: string,
  userId: string,
  personName: string,
  personId: string,
  subject: string,
  description: string,
) {
  try {
    const attendanceId = uuidv4()
    const now = new Date()

    await db.insert(attendances).values({
      id: attendanceId,
      session_id: sessionId,
      user_id: userId,
      person_name: personName,
      person_id: personId,
      subject,
      description,
      created_at: now,
    })

    revalidatePath("/dashboard")
    return { success: true, id: attendanceId }
  } catch (error) {
    console.error("Error al crear atención:", error)
    return { success: false, error: "Error al registrar la atención" }
  }
}
