"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { toast } from "sonner"
import { useRouter, usePathname } from "next/navigation"
import { Globe, LogOut, Home, List, PenLine, Eye, User, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

import config from "../../config"

// Desktop Navigation item component
const NavItem = ({ icon, text, active = false, href, onClick, isMobile = false }) => {
    const linkClasses = cn(
        "flex flex-col items-center px-3 py-2 text-sm hover:bg-slate-800 rounded transition-colors",
        active && "bg-orange-400",
        onClick && "cursor-pointer",
        isMobile && active ? "bg-orange-400" : "hover:bg-slate-800",
        isMobile && "px-4 py-3 rounded-md text-center justify-center"
    )

    return href ? (
        <Link href={href} className={linkClasses}>
            {icon}
            <span className={cn(isMobile ? "text-sm" : "mt-1 text-xs")}>{text}</span>
        </Link>
    ) : (
        <div className={linkClasses} onClick={onClick}>
            {icon}
            <span className={cn(isMobile ? "text-sm" : "mt-1 text-xs")}>{text}</span>
        </div>
    )
}

const Navigation = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const router = useRouter()
    const pathName = usePathname()
    const { data: session } = useSession()

    if (!session) {
        return <p>Loading...</p>
    }

    const { role } = session.user

    const handleLogout = async () => {
        try {
            signOut({ callbackUrl: "/login" })
        } catch (error) {
            console.error("Logout failed", error)
        }
    }

    const navItems =
        role === "admin"
            ? [
                  { icon: <PenLine size={18} />, text: "Evaluation", href: "/evaluation" },
                  { icon: <List size={18} />, text: "Exam list", href: "/exams-list" },
                  { icon: <Eye size={18} />, text: "Monitoring ", href: "/results" },
                  { icon: <Home size={18} />, text: "College", href: "/support" },
                  { icon: <User size={18} />, text: "Profile", href: "/profile" },
                  { icon: <LogOut size={18} />, text: "Sign out", onClick: handleLogout },
              ]
            : [
                  { icon: <PenLine size={18} />, text: "Evaluation", href: "/evaluation" },
                  { icon: <User size={18} />, text: "Profile", href: "/profile" },
                  { icon: <LogOut size={18} />, text: "Sign out", onClick: handleLogout },
              ]

    return (
        <div className="w-full">
            {/* Main navigation bar */}
            <nav className="bg-slate-900 text-white relative">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <span className="text-2xl font-bold text-white">{config.siteName}</span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {navItems.map((item, index) => (
                                <NavItem
                                    key={index}
                                    icon={item.icon}
                                    text={item.text}
                                    href={item.href}
                                    active={pathName === item.href}
                                    onClick={item.onClick ? item.onClick : undefined}
                                />
                            ))}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden p-2 rounded-md hover:bg-slate-800"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                <div
                    className={`
          lg:hidden fixed inset-y-0 right-0 transform 
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
          w-64 bg-slate-900 shadow-lg transition-transform duration-300 ease-in-out
          z-50 h-screen overflow-y-auto
        `}
                >
                    <div className="p-4 space-y-4">
                        {navItems.map((item, index) => (
                            <NavItem
                                key={index}
                                icon={item.icon}
                                text={item.text}
                                href={item.href}
                                active={pathName === item.href}
                                onClick={item.onClick ? item.onClick : undefined}
                                isMobile={true}
                            />
                        ))}
                    </div>
                </div>

                {/* Overlay */}
                {isMobileMenuOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}
            </nav>

            {/* Language selector bar */}
            <div className="w-full bg-orange-400 py-2 px-4 text-right">
                <button className="text-white flex items-center ml-auto">
                    <Globe size={16} className="mr-1" />
                    English
                </button>
            </div>
        </div>
    )
}

export default Navigation
