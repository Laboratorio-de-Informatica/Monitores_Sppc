import { requireAdmin } from "@/lib/utils/auth"
import { db } from "@/lib/db"
import AdminHeader from "../admin-header"
import ActivityReport from "./activity-report"

export default async function ActivityPage() {
    const session = await requireAdmin()

    // Obtener la lista de monitores
    const monitors = await db.query.users.findMany({
        where: (users, { eq }) => eq(users.role, "monitor"),
        orderBy: (users, { asc }) => [asc(users.username)],
    })

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader username={session.user.username} />

            <main className="container mx-auto py-6 px-4">
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h1 className="text-2xl font-bold mb-2">Reportes de Actividad</h1>
                    <p className="text-gray-600">
                        Selecciona un monitor y un período para generar reportes de actividad y estadísticas.
                    </p>
                </div>

                <ActivityReport monitors={monitors} />
            </main>
        </div>
    )
}
