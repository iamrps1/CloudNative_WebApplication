import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { getTeachersBySubject } from "@/lib/db/teachers"

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const subject = searchParams.get("subject")

        if (!subject) {
            return new NextResponse("Subject is required", { status: 400 })
        }

        const teachers = await getTeachersBySubject(subject)
        return NextResponse.json(teachers)
    } catch (error) {
        console.error("Error fetching teachers by subject:", error)
        return new NextResponse(error.message || "Internal Server Error", { status: 500 })
    }
}
