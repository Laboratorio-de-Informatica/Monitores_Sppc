import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db/migrate"

export async function GET() {
  try {
    const result = await initializeDatabase()

    if (result.success) {
      return NextResponse.json({ message: result.message }, { status: 200 })
    } else {
      return NextResponse.json({ error: result.message }, { status: 500 })
    }
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json({ error: "Error initializing database" }, { status: 500 })
  }
}
