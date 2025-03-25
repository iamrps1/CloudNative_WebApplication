import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { getTeacherByEmail } from "@/lib/db/teachers"

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const email = request.nextUrl.searchParams.get("email")
        if (!email) {
            return new NextResponse("Email is required", { status: 400 })
        }

        // Only allow users to access their own data or admins to access any data
        if (session.user.role !== "admin" && session.user.email !== email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const teacher = await getTeacherByEmail(email)
        return NextResponse.json(teacher)
    } catch (error) {
        console.error("Error fetching teacher:", error)
        return new NextResponse(error.message || "Internal Server Error", { status: 500 })
    }
}
