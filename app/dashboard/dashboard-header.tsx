"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { logout } from "./actions"
import { Button } from "@/components/ui/button"
import { LogOut, User, Clock, Shield } from "lucide-react"
import Link from "next/link"

interface DashboardHeaderProps {
  username: string
  loginTime: string
  sessionId: string
}

export default function DashboardHeader({ username, loginTime, sessionId }: DashboardHeaderProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoading(true)
    await logout(sessionId)
    router.push("/login")
  }

  const isAdmin = username === "admin"

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold">Sistema de Registro de Atenciones</h1>
            <div className="flex items-center mt-2 text-gray-600">
              <User className="h-4 w-4 mr-1" />
              <span className="mr-4">
                Usuario: <strong>{username}</strong>
              </span>
              <Clock className="h-4 w-4 mr-1" />
              <span>
                Inicio de sesión: <strong>{loginTime}</strong>
              </span>
            </div>
          </div>

          <div className="flex mt-4 md:mt-0 space-x-4">
            {isAdmin && (
              <Link href="/admin">
                <Button variant="outline" className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Panel Admin
                </Button>
              </Link>
            )}
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
