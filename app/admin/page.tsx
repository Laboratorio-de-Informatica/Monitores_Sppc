import { requireAuth } from "@/lib/utils/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema" // Importa la tabla users del esquema
import { asc } from "drizzle-orm" // Importa el helper para ordenamiento
import AdminHeader from "./admin-header"
import UserSelector from "./user-selector"

export default async function AdminPage() {
  const session = await requireAuth()

  // Verificar si el usuario es administrador
  if (session.user.role !== "admin") {
    redirect("/dashboard")
  }

  // Obtener la lista de usuarios usando Drizzle ORM
  const usersList = await db.query.users.findMany({
    columns: {
      id: true,
      username: true,
      created_at: true
    },
    orderBy: [asc(users.username)]
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader username={session.user.username} sessionId={session.id} />

      <main className="container mx-auto py-6 px-4">
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
          <p className="text-gray-600">Selecciona un usuario para ver su actividad y las personas que ha atendido.</p>
        </div>

        <UserSelector users={usersList} />
      </main>
    </div>
  )
}