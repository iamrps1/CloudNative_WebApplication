import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Replace with real database logic
                const users = [
                    { id: 1, email: "admin@example.com", password: "adminpass", role: "admin" },
                    { id: 2, email: "teacher@example.com", password: "teacherpass", role: "teacher" },
                ]

                const user = users.find((u) => u.email === credentials.email && u.password === credentials.password)

                if (user) {
                    return { id: user.id, email: user.email, role: user.role }
                } else {
                    throw new Error("Invalid credentials")
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            session.user.role = token.role // Attach role to session
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role // Save role in token
            }
            return token
        },
    },
    secret: process.env.NEXT_AUTH_SECRET,
    session: {
        strategy: "jwt",
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
