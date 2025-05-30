import { NextResponse } from "next/server"
import { deleteDocument } from "@/lib/db/documents" // AWS SDK logic here

export async function POST(req) {
    try {
        const body = await req.json()
        const { teacherId, documentId } = body

        await deleteDocument(teacherId, documentId)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("API error:", error)
        return NextResponse.json({ error: "Delete failed" }, { status: 500 })
    }
}
