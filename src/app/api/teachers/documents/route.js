import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { getTeacherDocuments } from "@/lib/db/documents"

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const teacherId = request.nextUrl.searchParams.get("teacherId")
        if (!teacherId) {
            return new NextResponse("Teacher ID is required", { status: 400 })
        }

        // Only allow teachers to access their own documents or admins to access any documents
        if (session.user.role !== "admin" && session.user.id !== teacherId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        try {
            const documents = await getTeacherDocuments(teacherId)
            return NextResponse.json(documents || [])
        } catch (error) {
            console.error("Error in getTeacherDocuments:", error)
            return new NextResponse("Failed to fetch documents", { status: 500 })
        }
    } catch (error) {
        console.error("Error in API route:", error)
        return new NextResponse(error.message || "Internal Server Error", { status: 500 })
    }
}
