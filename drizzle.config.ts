import type { Config } from "drizzle-kit"
import { config } from "dotenv"

// Cargar variables de entorno
config()

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.POSTGRES_HOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    user: process.env.POSTGRES_USER || "admin",
    password: process.env.POSTGRES_PASSWORD || "secretpassword",
    database: process.env.POSTGRES_DB || "monitoria",
    ssl: false,
  },
} satisfies Config