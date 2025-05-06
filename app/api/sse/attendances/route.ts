import { db } from "@/lib/db"
import { attendances } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import { getSession } from "@/lib/utils/auth"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("sessionId")
  const lastEventId = searchParams.get("lastEventId") || "0"
  const timestamp = new Date(Number.parseInt(lastEventId) || Date.now())

  // Verificar autenticación
  const session = await getSession()
  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }

  // Configurar respuesta SSE
  const responseStream = new TransformStream()
  const writer = responseStream.writable.getWriter()
  const encoder = new TextEncoder()

  // Función para enviar eventos
  const sendEvent = async () => {
    try {
      let query = db.query.attendances.findMany({
        where: (attendances, { and, eq, gt }) =>
          and(eq(attendances.session_id, sessionId || ""), gt(attendances.created_at, timestamp)),
        orderBy: [desc(attendances.created_at)],
      })

      // Si no es admin, solo mostrar las atenciones de la sesión actual
      if (session.user.role !== "admin") {
        query = db.query.attendances.findMany({
          where: (attendances, { and, eq, gt }) =>
            and(eq(attendances.session_id, session.id), gt(attendances.created_at, timestamp)),
          orderBy: [desc(attendances.created_at)],
        })
      }

      const newAttendances = await query

      if (newAttendances.length > 0) {
        const data = JSON.stringify(newAttendances)
        await writer.write(encoder.encode(`data: ${data}\n\n`))
      }

      // Mantener la conexión abierta
      await writer.write(encoder.encode(": keepalive\n\n"))
    } catch (error) {
      console.error("Error en SSE:", error)
      await writer.write(encoder.encode(`data: ${JSON.stringify({ error: "Error interno" })}\n\n`))
    }
  }

  // Enviar eventos iniciales
  sendEvent()

  // Configurar intervalo para enviar actualizaciones
  const intervalId = setInterval(sendEvent, session.user.role === "admin" ? 30000 : 1000)

  // Manejar cierre de conexión
  request.signal.addEventListener("abort", () => {
    clearInterval(intervalId)
    writer.close()
  })

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
