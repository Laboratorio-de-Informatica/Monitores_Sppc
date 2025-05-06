"use client"; // Añade esta directiva

import { useState } from "react"
import { useRouter } from "next/navigation"
import { logout } from "../dashboard/actions"
import { Button } from "@/components/ui/button"
import { LogOut, User, LayoutDashboard, Users, Activity } from "lucide-react"
import Link from "next/link"
// Elimina esta importación: import { getSession } from "@/lib/utils/auth"

interface AdminHeaderProps {
  username: string;
  sessionId: string; // Añade sessionId como prop
}

export default function AdminHeader({ username, sessionId }: AdminHeaderProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoading(true)
    // Usa el sessionId que recibes como prop
    await logout(sessionId)
    router.push("/login")
  }

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold">Panel de Administración</h1>
            <div className="flex items-center mt-2 text-gray-600">
              <User className="h-4 w-4 mr-1" />
              <span className="mr-4">
                Administrador: <strong>{username}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap mt-4 md:mt-0 gap-2">
            <Link href="/admin/users">
              <Button variant="outline" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Usuarios
              </Button>
            </Link>
            <Link href="/admin/activity">
              <Button variant="outline" className="flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Actividad
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="flex items-center">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Button variant="outline" className="flex items-center" onClick={handleLogout} disabled={loading}>
              <LogOut className="h-4 w-4 mr-2" />
              {loading ? "Cerrando sesión..." : "Cerrar Sesión"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
