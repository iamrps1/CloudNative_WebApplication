"use client"

import { useState } from "react"
import Link from "next/link"
import {
    Globe,
    LogOut,
    HelpCircle,
    Video,
    Home,
    List,
    PenLine,
    Eye,
    User,
    Menu,
    X,
} from "lucide-react"
import { useRouter } from "next/navigation"

// Desktop Navigation item component
const NavItem = ({ icon, text, active = false, onClick }) => {
    return onClick === undefined ? (
        <Link
            href="#"
            className={`flex flex-col items-center px-3 py-2 text-sm hover:bg-slate-800 rounded transition-colors
          ${active ? "bg-orange-400" : ""}`}
        >
            {icon}
            <span className="mt-1 text-xs">{text}</span>
        </Link>
    ) : (
        <div
            className={`flex flex-col items-center px-3 py-2 text-sm hover:bg-slate-800 rounded transition-colors
          ${active ? "bg-orange-400" : ""}`}
            onClick={onClick}
        >
            {icon}
            <span className="mt-1 text-xs">{text}</span>
        </div>
    )
}

// Mobile Navigation item component
const MobileNavItem = ({ icon, text, active = false, href, onClick }) => {
    return href ? (
        <Link href={href}>
            <a
                className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors
                ${active ? "bg-orange-400" : "hover:bg-slate-800"}`}
            >
                {icon}
                <span className="text-sm">{text}</span>
            </a>
        </Link>
    ) : (
        <div
            className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors
                ${active ? "bg-orange-400" : "hover:bg-slate-800"}`}
            onClick={onClick}
        >
            {icon}
            <span className="text-sm">{text}</span>
        </div>
    )
}

const Navigation = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const router = useRouter()

    const handleLogout = async () => {
        try {
            // Call the logout API
            const response = await fetch("/api/logout", { method: "POST" })

            console.log(response)
            if (response.ok) {
                router.push("/login")
            } else {
                console.error("Logout failed")
            }
        } catch (error) {
            console.error("Logout failed", error)
        }
    }

    const navItems = [
        { icon: <PenLine size={18} />, text: "New exam" },
        { icon: <List size={18} />, text: "Exam list", active: true },
        { icon: <Eye size={18} />, text: "Monitoring / Results" },
        { icon: <Home size={18} />, text: "My school" },
        { icon: <User size={18} />, text: "Profile" },
        { icon: <LogOut size={18} />, text: "Sign out", onClick: handleLogout },
        { icon: <Video size={18} />, text: "Training videos" },
        { icon: <HelpCircle size={18} />, text: "Support" },
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
                                <span className="text-2xl font-bold text-white">
                                    CopySure - Authentic Check
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {navItems.map((item, index) => (
                                <NavItem
                                    key={index}
                                    icon={item.icon}
                                    text={item.text}
                                    active={item.active}
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
                            <MobileNavItem
                                key={index}
                                icon={item.icon}
                                text={item.text}
                                active={item.active}
                                onClick={item.onClick ? item.onClick : undefined}
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
