import { cookies } from "next/headers"

const ProfilePage = async () => {
    const cookieStore = await cookies()

    const email = cookieStore.get("email")

    return (
        <div>
            Profile Page
            <div className="my-5">Email: {email.value}</div>
        </div>
    )
}

export default ProfilePage
