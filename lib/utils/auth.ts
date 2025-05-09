import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import * as bcrypt from "bcryptjs"
import { db } from "../db"
import { sessions } from "../db/schema"
import { eq } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash)
}

export async function getSession() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session_id")?.value

  if (!sessionId) {
    return null
  }

  const session = await db.query.sessions.findFirst({
    where: (sessions, { eq, and }) => and(eq(sessions.id, sessionId), eq(sessions.is_active, true)),
    with: {
      user: true,
    },
  })

  return session
}

export async function requireAuth() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  // Verificar si el usuario está activo
  if (session.user.status !== "active") {
    // Cerrar sesión si el usuario está inactivo
    await db.update(sessions).set({ is_active: false, logout_time: new Date() }).where(eq(sessions.id, session.id))

    const cookieStore = await cookies()
    cookieStore.delete("session_id")

    redirect("/login?error=inactive")
  }

  return session
}

export async function requireAdmin() {
  const session = await requireAuth()

  if (session.user.role !== "admin") {
    redirect("/dashboard")
  }

  return session
}

export async function createSession(userId: string, scheduledStartTime?: Date) {
  const sessionId = uuidv4()
  const now = new Date()

  // Calcular puntualidad si hay hora programada
  let punctualityMinutes: number | undefined = undefined
  if (scheduledStartTime) {
    const diffMs = now.getTime() - scheduledStartTime.getTime()
    punctualityMinutes = Math.round(diffMs / 60000) // Convertir a minutos
  }

  await db.insert(sessions).values({
    id: sessionId,
    user_id: userId,
    login_time: now,
    is_active: true,
    scheduled_start_time: scheduledStartTime,
    punctuality_minutes: punctualityMinutes,
  })

  // Guardar ID de sesión en cookie
  const cookieStore = await cookies()
  cookieStore.set("session_id", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 día
    path: "/",
  })

  return sessionId
}
