import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

// Crear cliente SQL usando la URL de conexión de PostgreSQL
const connectionString =
  process.env.DATABASE_URL || "postgres://usuario:contraseña@localhost:5432/nombre_base_datos"

// Crear cliente postgres.js
const client = postgres(connectionString, {
  max: 10, // Máximo de conexiones en el pool
  idle_timeout: 20, // Tiempo máximo de inactividad antes de cerrar la conexión
})

// Crear cliente Drizzle
export const db = drizzle(client, { schema })

// Función auxiliar para ejecutar consultas SQL directas
export async function query(text: string, params: any[] = []) {
  try {
    return await client.unsafe(text, params)
  } catch (error) {
    console.error("Error executing query:", error)
    throw error
  }
}

// Función para obtener un solo registro
export async function queryOne(text: string, params: any[] = []) {
  const result = await query(text, params)
  return result[0] || null
}

// Función para obtener múltiples registros
export async function queryMany(text: string, params: any[] = []) {
  return await query(text, params)
}
