"use client"

import { useSession } from "next-auth/react"

const ProfilePage = () => {
    const { data: session, status } = useSession()
    if (status === "loading") {
        return <div>Loading...</div>
    }
    return (
        <div>
            Profile Page
            <div>
                <h1>{session?.user?.email}</h1>
            </div>
            <div className="my-5">Edit Name, email id, reset password and much more in near future</div>
        </div>
    )
}

export default ProfilePage
