import SessionProvider from "@/components/session-provider"
import config from "../../config"
import "./globals.css"

export const metadata = {
    title: config.siteName.fullName,
    description: config.siteDescription,
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`antialiased`}>
                <SessionProvider>{children}</SessionProvider>
            </body>
        </html>
    )
}
