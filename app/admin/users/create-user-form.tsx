"use client"

import type React from "react"

import { useState } from "react"
import { register } from "@/app/register/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreateUserForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("monitor")
  const [scheduledTime, setScheduledTime] = useState("")
  const [scheduledEndTime, setScheduledEndTime] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append("username", username)
      formData.append("password", password)
      formData.append("role", role)
      formData.append("scheduledStartTime", scheduledTime)
      formData.append("scheduledEndTime", scheduledEndTime)

      const result = await register(formData)
      if (result.success) {
        setSuccess(true)
        // Limpiar el formulario
        setUsername("")
        setPassword("")
        setRole("monitor")
        setScheduledTime("")
        setScheduledEndTime("")

        // Ocultar el mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setSuccess(false)
        }, 3000)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("Ocurrió un error al registrar el usuario")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription>Usuario creado con éxito</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="username">Nombre de Usuario</Label>
        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Rol</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="monitor">Monitor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {role === "monitor" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="scheduledTime">Hora Programada de Inicio (opcional)</Label>
            <Input
              id="scheduledTime"
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
            <p className="text-xs text-gray-500">Hora a la que el monitor debe iniciar sesión</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduledEndTime">Hora Programada de Fin (opcional)</Label>
            <Input
              id="scheduledEndTime"
              type="time"
              value={scheduledEndTime}
              onChange={(e) => setScheduledEndTime(e.target.value)}
            />
            <p className="text-xs text-gray-500">Hora a la que el monitor debe finalizar su monitoría</p>
          </div>
        </>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creando usuario..." : "Crear Usuario"}
      </Button>
    </form>
  )
}
