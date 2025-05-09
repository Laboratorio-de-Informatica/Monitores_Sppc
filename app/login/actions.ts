"use server"

import { comparePassword } from "@/lib/utils/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { createSession } from "@/lib/utils/auth"

export async function login(username: string, password: string) {
  try {
    // Buscar usuario por nombre de usuario
    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    })

    if (!user) {
      return { success: false, error: "Usuario o contraseña incorrectos" }
    }

    // Verificar si el usuario está activo
    if (user.status !== "active") {
      return { success: false, error: "Tu cuenta está inactiva. Contacta al administrador." }
    }

    // Verificar contraseña
    const passwordMatch = await comparePassword(password, user.password)  
    if (!passwordMatch) {
      return { success: false, error: "Usuario o contraseña incorrectos" }
    }

    // Obtener hora programada si existe
    let scheduledStartTime = undefined
    if (user.scheduledStartTime) {
      const [hours, minutes] = user.scheduledStartTime.split(":").map(Number)
      const now = new Date()
      scheduledStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)
    }

    // Crear nueva sesión
    await createSession(user.id, scheduledStartTime)

    return { success: true }
  } catch (error) {
    console.error("Error en login:", error)
    return { success: false, error: "Error al iniciar sesión" }
  }
}
