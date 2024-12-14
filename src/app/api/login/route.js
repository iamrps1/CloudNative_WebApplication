import { createSession } from "@/lib/session"

import { cookies } from "next/headers"

export async function create(data) {}
export async function POST(req) {
    const formData = await req.json()

    const { email, password } = formData

    if (email !== "rhvsingh004@gmail.com" || password !== "123") {
        return new Response(JSON.stringify({ error: "Incorrect username or password" }), {
            status: 401,
            headers: {
                "Content-Type": "application/json",
            },
        })
    }

    //   const secretKey = process.env.SESSION_SECRET;

    //   const token = jwt.sign({ username }, secretKey);

    //   const cookie = serialize('token', token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //     path: '/',
    //     sameSite: 'strict',
    //   });

    const cookieStore = await cookies()

    //cookieStore.set("email", email)
    // or
    //cookieStore.set("password", password, { secure: true })
    // or
    cookieStore.set({
        name: "email",
        value: email,
        httpOnly: true,
        path: "/",
    })

    cookieStore.set({
        name: "password",
        value: password,
        httpOnly: true,
        path: "/",
    })

    return new Response(JSON.stringify({ message: "Login successful" }), {
        headers: {
            "Set-Cookie": cookieStore,
            "Content-Type": "application/json",
        },
        status: 200,
    })
}
