import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { attendances } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    const attendancesList = await db.query.attendances.findMany({
      where: eq(attendances.session_id, sessionId),
      orderBy: [desc(attendances.created_at)],
    })

    return NextResponse.json(attendancesList)
  } catch (error) {
    console.error("Error fetching attendances:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
