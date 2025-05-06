"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { register } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function RegisterForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    try {
      const result = await register(username, password)
      if (result.success) {
        router.push("/login")
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

      <div className="space-y-2">
        <Label htmlFor="username">Usuario</Label>
        <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Registrando..." : "Registrarse"}
      </Button>

      <div className="text-center text-sm">
        <a href="/login" className="text-blue-600 hover:underline">
          ¿Ya tienes una cuenta? Inicia sesión
        </a>
      </div>
    </form>
  )
}
