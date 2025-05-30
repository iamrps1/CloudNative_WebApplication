import { Toaster } from "sonner"

import Navigation from "@/components/navigation"
import QueryProvider from "@/components/query-client-provider"

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <QueryProvider>
                    <Toaster richColors />
                    <Navigation />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
                </QueryProvider>
            </body>
        </html>
    )
}
