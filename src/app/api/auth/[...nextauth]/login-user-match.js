import loginDetails from "./login-details"
import { getTeacherByEmail } from "@/lib/db/teachers"
import bcrypt from "bcryptjs"

const FetchUser = async (email, password) => {
    // First check static login details
    const staticUser = loginDetails.find((u) => u.email === email && u.password === password)
    if (staticUser) {
        return staticUser
    }

    // If not found in static list, check DynamoDB
    try {
        const dbUser = await getTeacherByEmail(email)
        if (dbUser && dbUser.password) {
            // Compare hashed password
            const isValidPassword = await bcrypt.compare(password, dbUser.password)
            if (isValidPassword) {
                return {
                    id: dbUser.id,
                    email: dbUser.email,
                    name: dbUser.name,
                    role: dbUser.role || "teacher",
                    subjects: dbUser.subjects || [],
                }
            }
        }
    } catch (error) {
        console.error("Error checking DynamoDB user:", error)
    }

    return null
}

export default FetchUser
