"use client"

import type React from "react"

import { useState } from "react"
import { createAttendance } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

interface AttendanceFormProps {
  sessionId: string
  userId: string
}

export default function AttendanceForm({ sessionId, userId }: AttendanceFormProps) {
  const [personName, setPersonName] = useState("")
  const [personId, setPersonId] = useState("")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await createAttendance(sessionId, userId, personName, personId, subject, description)

      if (result.success) {
        setSuccess(true)
        // Limpiar el formulario
        setPersonName("")
        setPersonId("")
        setSubject("")
        setDescription("")

        // Ocultar el mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setSuccess(false)
        }, 3000)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("Ocurrió un error al registrar la atención")
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
          <AlertDescription>Atención registrada con éxito</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="personName">Nombre Completo</Label>
        <Input id="personName" value={personName} onChange={(e) => setPersonName(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="personId">Identificación</Label>
        <Input id="personId" value={personId} onChange={(e) => setPersonId(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Materia/Asunto</Label>
        <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción de la Atención</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Registrando..." : "Registrar Atención"}
      </Button>
    </form>
  )
}
