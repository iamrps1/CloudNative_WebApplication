"use client"

import { DashboardCard } from "@/components/ui/cards"
import { cn } from "@/lib/utils"
import { Home, FileText, PenLine, User, FileQuestion, List } from "lucide-react"
import config from "../../../config"
import { useSession } from "next-auth/react"

const quickLinks = [
    {
        id: 1,
        name: "Document Management",
        href: "/documents",
        icon: <FileText size={40} />,
        bgColor: "bg-sky-700",
        description: "Upload, view, and manage your documents for evaluation.",
        adminOnly: false,
    },
    {
        id: 2,
        name: "Assign Docs",
        href: "/assign",
        icon: <List size={40} />,
        bgColor: "bg-orange-500",
        description: "Admins can assign documents to teachers for checking.",
        adminOnly: true,
    },
    {
        id: 3,
        name: "Evaluation",
        href: "/evaluation",
        icon: <PenLine size={40} />,
        bgColor: "bg-violet-500",
        description: "Check and evaluate assigned documents (for teachers).",
        adminOnly: false,
    },
    {
        id: 4,
        name: "Profile",
        href: "/profile",
        icon: <User size={40} />,
        bgColor: "bg-rose-500",
        description: "View and manage your profile details.",
        adminOnly: false,
    },
    {
        id: 5,
        name: "Support",
        href: "/support",
        icon: <FileQuestion size={40} />,
        bgColor: "bg-gray-700",
        description: "Frequently asked questions and help resources.",
        adminOnly: false,
    },
]

const MainDashboard = () => {
    const { data: session } = useSession()
    const userName = session?.user?.name || session?.user?.email || "there"
    const isAdmin = session?.user?.role === "admin"
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold my-5 text-accent">
                Welcome, <span className="capitalize">{userName}</span>!
            </h1>
            <p className="mb-8 text-lg text-gray-300 max-w-2xl">
                {config.siteDescription || "SmartGrades is a platform for colleges to check and manage copies."}
            </p>
            <div className="my-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quickLinks
                    .filter((link) => {
                        if (isAdmin) return link.name !== "Document Management"
                        return link.name !== "Assign Docs"
                    })
                    .map((link) => (
                        <a key={link.id} href={link.href} className="block">
                            <DashboardCard
                                icon={link.icon}
                                className={cn(
                                    link.bgColor,
                                    "hover:scale-[1.03] transition-transform duration-200 cursor-pointer bg-opacity-90 text-white border-none min-h-[180px]"
                                )}
                            >
                                <h3 className="text-xl font-bold mb-2">{link.name}</h3>
                                <p className="text-sm text-slate-200 mb-2 min-h-[48px]">{link.description}</p>
                            </DashboardCard>
                        </a>
                    ))}
            </div>
        </div>
    )
}

export default MainDashboard
