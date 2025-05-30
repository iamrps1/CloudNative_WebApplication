import { cookies } from "next/headers"

export async function isAuthenticated() {
    const cookieStore = await cookies()
    const email = cookieStore.get("email")
    const password = cookieStore.get("password")
    const role = cookieStore.get("role")

    if (email === undefined || password === undefined || role === undefined) {
        return false
    }
    return true
}
