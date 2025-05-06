"use server"

import { hashPassword, requireAdmin } from "@/lib/utils/auth"
import { db } from "@/lib/db"
import { users, sessions, attendances } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"
import { revalidatePath } from "next/cache"

// Modificar la función register para incluir la hora de fin
export async function register(formData: FormData) {
  try {
    // Solo los administradores pueden registrar usuarios
    await requireAdmin()

    const username = formData.get("username") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as string
    const scheduledStartTime = (formData.get("scheduledStartTime") as string) || null
    const scheduledEndTime = (formData.get("scheduledEndTime") as string) || null

    // Verificar si el usuario ya existe
    const existingUser = await db.query.users.findFirst({
      where: eq(users.username, username),
    })

    if (existingUser) {
      return { success: false, error: "El nombre de usuario ya está en uso" }
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password)

    // Crear nuevo usuario
    await db.insert(users).values({
      id: uuidv4(),
      username,
      password: hashedPassword,
      role,
      status: "active",
      scheduledStartTime,
      scheduledEndTime,
      created_at: new Date(),
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error en registro:", error)
    return { success: false, error: "Error al crear el usuario" }
  }
}

export async function updateUserStatus(userId: string, status: string) {
  try {
    // Solo los administradores pueden actualizar el estado de los usuarios
    await requireAdmin()

    await db.update(users).set({ status }).where(eq(users.id, userId))

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error al actualizar estado del usuario:", error)
    return { success: false, error: "Error al actualizar el estado del usuario" }
  }
}

// Modificar la función updateScheduledTime para incluir la hora de fin
export async function updateScheduledTime(userId: string, scheduledStartTime: string, scheduledEndTime: string) {
  try {
    // Solo los administradores pueden actualizar la hora programada
    await requireAdmin()

    await db
      .update(users)
      .set({
        scheduledStartTime,
        scheduledEndTime,
      })
      .where(eq(users.id, userId))

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error al actualizar hora programada:", error)
    return { success: false, error: "Error al actualizar la hora programada" }
  }
}

export async function deleteUser(userId: string) {
  try {
    // Solo los administradores pueden eliminar usuarios
    await requireAdmin()

    // Primero eliminamos las atenciones asociadas al usuario
    await db.delete(attendances).where(eq(attendances.user_id, userId))

    // Luego eliminamos las sesiones asociadas al usuario
    await db.delete(sessions).where(eq(sessions.user_id, userId))

    // Finalmente eliminamos al usuario
    await db.delete(users).where(eq(users.id, userId))

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error al eliminar usuario:", error)
    return { success: false, error: "Error al eliminar el usuario" }
  }
}
