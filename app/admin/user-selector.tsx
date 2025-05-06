"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserSessions from "./user-sessions"
import UserAttendances from "./user-attendances"

interface User {
  id: string
  username: string
  created_at: string
}

interface UserSelectorProps {
  users: User[]
}

export default function UserSelector({ users }: UserSelectorProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const selectedUser = users.find((user) => user.id === selectedUserId)

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Usuario
            </label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Selecciona un usuario" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedUser && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Información del Usuario</h3>
              <p className="text-sm text-gray-600">
                <strong>Usuario:</strong> {selectedUser.username}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Fecha de registro:</strong>{" "}
                {format(new Date(selectedUser.created_at), "dd MMMM yyyy, HH:mm:ss", { locale: es })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedUserId && (
        <Tabs defaultValue="sessions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sessions">Sesiones</TabsTrigger>
            <TabsTrigger value="attendances">Atenciones</TabsTrigger>
          </TabsList>
          <TabsContent value="sessions">
            <UserSessions userId={selectedUserId} />
          </TabsContent>
          <TabsContent value="attendances">
            <UserAttendances userId={selectedUserId} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
