import { requireAdmin } from "@/lib/utils/auth"
import { db } from "@/lib/db"
import AdminHeader from "../admin-header"
import UserList from "./user-list"
import CreateUserForm from "./create-user-form"

export default async function UsersPage() {
  const session = await requireAdmin()

  // Obtener la lista de usuarios
  const usersList = await db.query.users.findMany({
    orderBy: (users, { asc }) => [asc(users.username)],
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader username={session.user.username} />

      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Crear Nuevo Usuario</h2>
              <CreateUserForm />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Gestión de Usuarios</h2>
              <UserList users={usersList} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
