import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import FetchUser from "./login-user-match"

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
                const user = await FetchUser(credentials.email, credentials.password)
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
            session.user.id = token.id // Attach id to session
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role // Save role in token
                token.id = user.id // Save id in token
            }
            return token
        },
        async redirect({ url, baseUrl }) {
            // Handle relative callback URLs
            if (url.startsWith("/")) {
                return `${baseUrl}${url}`
            }
            // Handle absolute URLs that match the app's domain
            else if (new URL(url).origin === baseUrl) {
                return url
            }
            return baseUrl
        },
    },
    pages: {
        signIn: "/login",
        signOut: "/login",
        error: "/login",
    },
    secret: process.env.NEXT_AUTH_SECRET,
    session: {
        strategy: "jwt",
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
