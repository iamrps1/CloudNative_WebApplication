import { Toaster } from "sonner"
import Navigation from "@/components/navigation"

export default async function RootLayout({ children }) {
    return (
        <>
            <Toaster richColors />
            <Navigation />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
        </>
    )
}
