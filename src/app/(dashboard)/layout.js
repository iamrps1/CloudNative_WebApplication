import { Toaster } from "sonner"
import { cookies } from "next/headers"
//import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"

import "../globals.css"

export const metadata = {
    title: "CopySure - Authentic Check",
    description: "Generated by create next app",
}

export default async function RootLayout({ children }) {
    const cookieStore = await cookies()
    const email = cookieStore.get("email")
    if (email === undefined || email === null || email === "") {
        redirect("/login")
    } else {
        //redirect("/dashboard")
    }
    // const { data: session, status } = useSession()
    // const cookieStore = cookies()

    // if (status === "authenticated") {
    //     return (
    //         <html lang="en">
    //             <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
    //                 Hello yellow
    //                 {children}
    //             </body>
    //         </html>
    //     )
    //     redirect("/dashboard")
    // } else {
    //     redirect("/login")
    // }
    //const token = cookieStore.get("token")

    // if (!token) {
    //     redirect("/login")
    // }

    // try {
    //     //jwt.verify(token.value, process.env.JWT_SECRET_KEY)
    // } catch (error) {
    //     redirect("/login")
    // }
    return (
        <html lang="en">
            <body className={` antialiased`}>
                <Toaster richColors />
                {children}
            </body>
        </html>
    )
}
