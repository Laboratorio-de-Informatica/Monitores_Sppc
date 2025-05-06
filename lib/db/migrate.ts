import { db } from "./index"
import * as schema from "./schema"
import * as bcrypt from "bcrypt"
import { v4 as uuidv4 } from "uuid"
import { sql } from "drizzle-orm"

// Función para inicializar la base de datos
export async function initializeDatabase() {
  try {
    // Crear tablas si no existen
    console.log("Creando tablas si no existen...")

    // Crear tabla de usuarios
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'monitor',
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        scheduled_start_time VARCHAR(50),
        scheduled_end_time VARCHAR(50),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    // Crear tabla de sesiones
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id),
        login_time TIMESTAMP NOT NULL,
        logout_time TIMESTAMP,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        scheduled_start_time TIMESTAMP,
        punctuality_minutes INTEGER
      )
    `)

    // Crear tabla de atenciones
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS attendances (
        id UUID PRIMARY KEY,
        session_id UUID NOT NULL REFERENCES sessions(id),
        user_id UUID NOT NULL REFERENCES users(id),
        person_name VARCHAR(255) NOT NULL,
        person_id VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    console.log("Tablas creadas correctamente")

    // Verificar si ya existe un usuario admin
    const adminUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.role, "admin"),
    })

    if (!adminUser) {
      console.log("Creando usuario admin por defecto...")
      // Crear usuario admin por defecto
      const hashedPassword = await bcrypt.hash("admin123", 10)
      await db.insert(schema.users).values({
        id: uuidv4(),
        username: "admin",
        password: hashedPassword,
        role: "admin",
        status: "active",
        created_at: new Date(),
      })
      console.log("Usuario admin creado con éxito")
    } else {
      console.log("Usuario admin ya existe, omitiendo creación")
    }

    return { success: true, message: "Base de datos inicializada correctamente" }
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error)
    return { success: false, message: "Error al inicializar la base de datos" }
  }
}
