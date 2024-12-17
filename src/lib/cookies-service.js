import { cookies } from "next/headers"

export default class CookiesService {
    constructor() {
        this.cookiesStore = cookies()
    }
    async get(key) {
        const cookiesStore = await cookies()
        const cookie = cookiesStore.get(key)
        if (cookie) {
            return JSON.parse(cookie.value)
        }
        return null
    }
    async set(key, value) {
        const cookiesStore = await cookies()
        if (typeof value === "object") {
            cookiesStore.set(key, JSON.stringify(value))
        } else {
            cookiesStore.set(key, value)
        }
    }
    async setSessionCookie(key, value) {
        const cookiesStore = await cookies()
        cookiesStore.set(key, JSON.stringify(value), {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60, // 1 hour
        })
    }
    async remove(key) {
        const cookiesStore = await cookies()
        cookiesStore.delete(key)
    }
}
