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

    const attendances = await queryMany(
      `SELECT * FROM attendances 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId],
    )

    return NextResponse.json(attendances)
  } catch (error) {
    console.error("Error fetching attendances:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
