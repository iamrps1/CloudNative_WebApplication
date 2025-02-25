import { cn } from "@/lib/utils"
import React from "react"

export const DashboardCard = ({ children, className, icon, iconPosition = "right" }) => {
    const iconPositionTypes = {
        right: "flex-row",
        left: "flex-row-reverse",
    }
    return (
        <div
            className={cn(
                "flex justify-between p-4 pb-16 gap-10 rounded-md relative shadow-md shadow-slate-700",
                iconPositionTypes[iconPosition],
                className
            )}
        >
            <div>{children}</div>
            <div>{icon}</div>
            <div className="h-10 w-full inset-x-0 bottom-0 flex-shrink-0 flex-grow bg-gray-950/25 absolute" />
        </div>
    )
}
