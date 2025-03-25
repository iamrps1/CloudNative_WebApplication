"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import AdminDocumentUpload from "@/components/AdminDocumentUpload"
import DocumentList from "@/components/DocumentList"

export default function DocumentsPage() {
    const { data: session } = useSession()
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)
    const [teacher, setTeacher] = useState(null)

    useEffect(() => {
        if (session?.user?.email) {
            loadUserData()
        }
    }, [session])

    const loadUserData = async () => {
        try {
            if (session?.user.role === "teacher") {
                // If teacher, load their profile and documents
                const teacherResponse = await fetch(
                    `/api/teachers/by-email?email=${encodeURIComponent(session.user.email)}`
                )
                if (!teacherResponse.ok) {
                    throw new Error("Failed to fetch teacher data")
                }
                const teacherData = await teacherResponse.json()
                setTeacher(teacherData)

                if (teacherData) {
                    const docsResponse = await fetch(
                        `/api/teachers/documents?teacherId=${encodeURIComponent(teacherData.id)}`
                    )
                    if (!docsResponse.ok) {
                        throw new Error("Failed to fetch documents")
                    }
                    const docs = await docsResponse.json()
                    setDocuments(docs)
                }
            }
        } catch (error) {
            console.error("Error loading user data:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleUploadSuccess = () => {
        // Reload documents after successful upload
        if (teacher) {
            loadUserData()
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Document Management</h1>

            {session?.user?.role === "admin" ? (
                // Admin View
                <div>
                    <h2 className="text-xl font-semibold mb-4">Upload Documents for Teachers</h2>
                    <AdminDocumentUpload onUploadSuccess={handleUploadSuccess} />
                </div>
            ) : session?.user?.role === "teacher" && teacher ? (
                // Teacher View
                <div>
                    <h2 className="text-xl font-semibold mb-4">Your Documents</h2>
                    <DocumentList documents={documents} loading={loading} />
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">You don&apos;t have permission to view this page.</div>
            )}
        </div>
    )
}
