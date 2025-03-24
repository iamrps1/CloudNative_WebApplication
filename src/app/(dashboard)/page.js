import { DashboardCard } from "@/components/ui/cards"
import { cn } from "@/lib/utils"
import { Home, Info, Mail, User } from "lucide-react"
import config from "../../../config"

const links = [
    {
        id: 1,
        name: "Home",
        href: "/",
        icon: <Home size={40} />,
        bgColor: "bg-sky-700",
        heading: "Check Authenticity",
        paragraph: "Check the authenticity of your product",
    },
    {
        id: 2,
        name: "About",
        href: "/about",
        icon: <Info size={40} />,
        bgColor: "bg-orange-500",
        heading: "Check Authenticity",
        paragraph: "Check the authenticity of your product",
    },
    {
        id: 3,
        name: "Contact",
        href: "/contact",
        icon: <Mail size={40} />,
        bgColor: "bg-rose-500",
        heading: "Check Authenticity",
        paragraph: "Check the authenticity of your product",
    },
    {
        id: 4,
        name: "Dashboard",
        href: "/dashboard",
        icon: <User size={40} />,
        bgColor: "bg-violet-500",
        heading: "Check Authenticity",
        paragraph: "Check the authenticity of your product",
    },
]

const MainDashboard = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold my-5">Welcome to the {config.siteName}</h1>

            <div className="my-5 grid grid-cols-3 gap-6">
                {links.map((link) => (
                    <DashboardCard key={link.id} icon={link.icon} className={cn(link.bgColor)}>
                        <h3 className="text-xl font-bold mb-2">{link.heading}</h3>
                        <p>{link.paragraph}</p>
                    </DashboardCard>
                ))}
            </div>
        </div>
    )
}

export default MainDashboard
