import { redirect } from "next/navigation"
import React from "react"

const Main = () => {
    redirect("/dashboard")
    return <div>Main</div>
}

export default Main
