import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { getTeacherByEmail } from "./db/teachers"

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter an email and password')
                }

                const teacher = await getTeacherByEmail(credentials.email)
                if (!teacher) {
                    throw new Error('No user found with this email')
                }

                const passwordMatch = await bcrypt.compare(credentials.password, teacher.password)
                if (!passwordMatch) {
                    throw new Error('Incorrect password')
                }

                return {
                    id: teacher.id,
                    email: teacher.email,
                    name: teacher.name,
                    role: teacher.role
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    role: user.role
                }
            }
            return token
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    role: token.role
                }
            }
        }
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
} 