import { type NextRequest, NextResponse } from "next/server"
import { queryMany } from "@/lib/db"
import { getSession } from "@/lib/utils/auth"

export async function GET(request: NextRequest) {
  try {
    // Verificar si el usuario es administrador
    const session = await getSession()
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const sessions = await queryMany(
      `SELECT * FROM sessions 
       WHERE user_id = $1 
       ORDER BY login_time DESC`,
      [userId],
    )

    return NextResponse.json(sessions)
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
