import { pgTable, serial, uuid, varchar, timestamp, boolean, text } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Tabla de usuarios
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("monitor"),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  scheduledStartTime: varchar("scheduled_start_time", { length: 50 }),
  scheduledEndTime: varchar("scheduled_end_time", { length: 50 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
})

// Tabla de sesiones
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id),
  login_time: timestamp("login_time").notNull(),
  logout_time: timestamp("logout_time"),
  is_active: boolean("is_active").notNull().default(true),
  scheduled_start_time: timestamp("scheduled_start_time"),
  punctuality_minutes: serial("punctuality_minutes"), // Positivo = tardanza, negativo = anticipación
})

// Tabla de atenciones
export const attendances = pgTable("attendances", {
  id: uuid("id").primaryKey().defaultRandom(),
  session_id: uuid("session_id")
    .notNull()
    .references(() => sessions.id),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id),
  person_name: varchar("person_name", { length: 255 }).notNull(),
  person_id: varchar("person_id", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
})

// Relaciones
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  attendances: many(attendances),
}))

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  user: one(users, {
    fields: [sessions.user_id],
    references: [users.id],
  }),
  attendances: many(attendances),
}))

export const attendancesRelations = relations(attendances, ({ one }) => ({
  session: one(sessions, {
    fields: [attendances.session_id],
    references: [sessions.id],
  }),
  user: one(users, {
    fields: [attendances.user_id],
    references: [users.id],
  }),
}))

// Tipos para TypeScript
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert
export type Attendance = typeof attendances.$inferSelect
export type NewAttendance = typeof attendances.$inferInsert
