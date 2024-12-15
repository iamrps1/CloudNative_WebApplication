import { NextResponse } from "next/server"

export async function POST() {
    const response = NextResponse.json({ message: "Logged out successfully" })
    // Clear the authentication cookie
    response.cookies.set("email", "", {
        maxAge: 0,
        path: "/",
    })

    response.cookies.set("password", "", {
        maxAge: 0,
        path: "/",
    })

    return response
}
