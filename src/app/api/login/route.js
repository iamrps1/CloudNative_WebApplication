import { ROLES } from "@/constants"
//import CookiesService from "@/lib/cookies-service"

import { cookies } from "next/headers"

//export async function create(data) {}
export async function POST(req) {
    const formData = await req.json()

    const { email, password } = formData

    const cookieStore = await cookies()

    //const cookieStore = new CookiesService()

    // if (email !== "rhvsingh004@gmail.com" || password !== "123") {
    //     return new Response(JSON.stringify({ error: "Incorrect username or password" }), {
    //         status: 401,
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //     })
    // }

    //   const secretKey = process.env.SESSION_SECRET;

    //   const token = jwt.sign({ username }, secretKey);

    //   const cookie = serialize('token', token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //     path: '/',
    //     sameSite: 'strict',
    //   });

    // console.log(cookieStore, "String check check")

    cookieStore.set("email", email)
    cookieStore.set("password", password)
    cookieStore.set("role", ROLES.ADMIN)

    return new Response(JSON.stringify({ message: "Login successful" }), {
        headers: {
            "Set-Cookie": cookieStore,
            "Content-Type": "application/json",
        },
        status: 200,
    })
}
