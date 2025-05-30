"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { DashboardCard } from "@/components/ui/cards"
import { Button } from "@/components/ui/button"

const ProfilePage = () => {
    const { data: session, status } = useSession()
    const [userDetails, setUserDetails] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (session?.user?.role === "teacher" && session?.user?.email) {
                try {
                    const res = await fetch(`/api/teachers/by-email?email=${encodeURIComponent(session.user.email)}`)
                    if (!res.ok) throw new Error("Failed to fetch user details")
                    const data = await res.json()
                    setUserDetails(data)
                } catch (err) {
                    setError("Could not load user details.")
                } finally {
                    setLoading(false)
                }
            } else if (session?.user) {
                // For admin or static users, use session data
                setUserDetails(session.user)
                setLoading(false)
            }
        }
        if (session) fetchUserDetails()
    }, [session])

    if (status === "loading" || loading) {
        return <div className="flex justify-center items-center h-40 text-accent">Loading...</div>
    }
    if (error) {
        return <div className="text-red-400 text-center py-8">{error}</div>
    }
    if (!userDetails) {
        return <div className="text-gray-400 text-center py-8">No user details found.</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <DashboardCard className="bg-gray-900 text-accent border border-accent max-w-xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold mb-4 text-accent">Profile</h1>
                    <div className="space-y-2">
                        {userDetails.name && (
                            <div>
                                <span className="font-semibold">Name:</span> {userDetails.name}
                            </div>
                        )}
                        {userDetails.email && (
                            <div>
                                <span className="font-semibold">Email:</span> {userDetails.email}
                            </div>
                        )}
                        {userDetails.id && (
                            <div>
                                <span className="font-semibold">User ID:</span> {userDetails.id}
                            </div>
                        )}
                        {userDetails.role && (
                            <div className="capitalize">
                                <span className="font-semibold">Role:</span> {userDetails.role}
                            </div>
                        )}
                        {userDetails.subjects &&
                            Array.isArray(userDetails.subjects) &&
                            userDetails.subjects.length > 0 && (
                                <div>
                                    <span className="font-semibold">Subjects:</span> {userDetails.subjects.join(", ")}
                                </div>
                            )}
                        {userDetails.status && (
                            <div className="capitalize">
                                <span className="font-semibold">Status:</span> {userDetails.status}
                            </div>
                        )}
                        {userDetails.createdAt && (
                            <div>
                                <span className="font-semibold">Created At:</span>{" "}
                                {new Date(userDetails.createdAt).toLocaleString()}
                            </div>
                        )}
                        {userDetails.updatedAt && (
                            <div>
                                <span className="font-semibold">Updated At:</span>{" "}
                                {new Date(userDetails.updatedAt).toLocaleString()}
                            </div>
                        )}
                    </div>
                    {/* <div className="mt-8 flex gap-4">
                        <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">
                            Edit Profile
                        </Button>
                        <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">
                            Reset Password
                        </Button>
                    </div> */}
                </div>
            </DashboardCard>
        </div>
    )
}

export default ProfilePage
