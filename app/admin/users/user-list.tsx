"use client"

import type React from "react"

import { useState } from "react"
import type { User } from "@/lib/db/schema"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { updateUserStatus, updateScheduledTime, deleteUser } from "@/app/register/actions"
import { Clock, Shield, UserIcon, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface UserListProps {
  users: User[]
}

export default function UserList({ users }: UserListProps) {
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [scheduledTime, setScheduledTime] = useState<Record<string, string>>({})
  const [scheduledEndTime, setScheduledEndTime] = useState<Record<string, string>>({})
  const [filteredUsers, setFilteredUsers] = useState(users)
  const [searchTerm, setSearchTerm] = useState("")

  const handleStatusChange = async (userId: string, newStatus: string) => {
    setLoading((prev) => ({ ...prev, [userId]: true }))
    try {
      await updateUserStatus(userId, newStatus)
      // Actualizar el estado local
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)),
      )
    } catch (error) {
      console.error("Error al cambiar estado:", error)
    } finally {
      setLoading((prev) => ({ ...prev, [userId]: false }))
    }
  }

  const handleScheduledTimeChange = async (userId: string) => {
    setLoading((prev) => ({ ...prev, [userId]: true }))
    try {
      await updateScheduledTime(userId, scheduledTime[userId] || "", scheduledEndTime[userId] || "")
      // Actualizar el estado local
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
              ...user,
              scheduledStartTime: scheduledTime[userId] || "",
              scheduledEndTime: scheduledEndTime[userId] || "",
            }
            : user,
        ),
      )
    } catch (error) {
      console.error("Error al actualizar hora programada:", error)
    } finally {
      setLoading((prev) => ({ ...prev, [userId]: false }))
    }
  }

  const handleDeleteUser = async (userId: string) => {
    setLoading((prev) => ({ ...prev, [userId]: true }))
    try {
      await deleteUser(userId)
      // Eliminar el usuario de la lista local
      setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))
    } catch (error) {
      console.error("Error al eliminar usuario:", error)
    } finally {
      setLoading((prev) => ({ ...prev, [userId]: false }))
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    if (!term.trim()) {
      setFilteredUsers(users)
    } else {
      setFilteredUsers(
        users.filter((user) => user.username.toLowerCase().includes(term) || user.role.toLowerCase().includes(term)),
      )
    }
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Input placeholder="Buscar usuarios..." value={searchTerm} onChange={handleSearch} className="max-w-md" />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No se encontraron usuarios</div>
      ) : (
        filteredUsers.map((user) => (
          <Card key={user.id} className={user.status === "inactive" ? "opacity-70" : ""}>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex items-center">
                  {user.role === "admin" ? (
                    <Shield className="h-5 w-5 mr-2 text-blue-500" />
                  ) : (
                    <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
                  )}
                  <div>
                    <h3 className="font-semibold">{user.username}</h3>
                    <div className="flex items-center mt-1">
                      <Badge variant={user.role === "admin" ? "default" : "secondary"} className="mr-2">
                        {user.role === "admin" ? "Administrador" : "Monitor"}
                      </Badge>
                      <Badge variant={user.status === "active" ? "outline" : "destructive"}>
                        {user.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
                  {user.role === "monitor" && (
                    <>
                      <div className="flex items-center text-sm text-gray-500 mr-4">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          {user.scheduledStartTime
                            ? `Horario: ${user.scheduledStartTime}${user.scheduledEndTime ? ` - ${user.scheduledEndTime}` : ""}`
                            : "Sin horario programado"}
                        </span>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            Programar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Programar Hora de Inicio</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor={`scheduledTime-${user.id}`}>Hora de Inicio</Label>
                              <Input
                                id={`scheduledTime-${user.id}`}
                                type="time"
                                defaultValue={user.scheduledStartTime || ""}
                                onChange={(e) => setScheduledTime((prev) => ({ ...prev, [user.id]: e.target.value }))}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`scheduledEndTime-${user.id}`}>Hora de Fin</Label>
                              <Input
                                id={`scheduledEndTime-${user.id}`}
                                type="time"
                                defaultValue={user.scheduledEndTime || ""}
                                onChange={(e) =>
                                  setScheduledEndTime((prev) => ({ ...prev, [user.id]: e.target.value }))
                                }
                              />
                            </div>

                            <div className="flex justify-end space-x-2">
                              <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                              </DialogClose>
                              <Button onClick={() => handleScheduledTimeChange(user.id)} disabled={loading[user.id]}>
                                {loading[user.id] ? "Guardando..." : "Guardar"}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}

                  {user.username !== "admin" && (
                    <>
                      <Button
                        variant={user.status === "active" ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleStatusChange(user.id, user.status === "active" ? "inactive" : "active")}
                        disabled={loading[user.id]}
                      >
                        {loading[user.id] ? "Procesando..." : user.status === "active" ? "Desactivar" : "Activar"}
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center">
                            <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                            Eliminar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará permanentemente al usuario <strong>{user.username}</strong> y no se
                              puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
