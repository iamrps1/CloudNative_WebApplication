import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { updateTeacherPassword } from "@/lib/db/teachers"

export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { teacherId } = params
        const { password } = await request.json()

        if (!password) {
            return new NextResponse("Password is required", { status: 400 })
        }

        await updateTeacherPassword(teacherId, password)
        return new NextResponse("Password updated successfully", { status: 200 })
    } catch (error) {
        console.error("Error updating teacher password:", error)
        return new NextResponse(error.message || "Internal Server Error", { status: 500 })
    }
}
