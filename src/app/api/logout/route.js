import { deleteCookies } from "@/lib/session"
import { NextResponse } from "next/server"

export async function POST() {
    const response = NextResponse.json({ message: "Logged out successfully" })
    // Clear the authentication cookie
    deleteCookies(response, ["email", "password", "role"])

    return response
}
