import { signIn } from "next-auth/react"

export async function POST(req) {
    const formData = await req.json()
    const { email, password } = formData

    console.log("first")
    const result = await signIn("Credentials", {
        redirect: false,
        email,
        password,
    })

    if (result?.error) {
        return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 })
    }

    return new Response(JSON.stringify({ message: "Login successful" }), { status: 200 })
}
