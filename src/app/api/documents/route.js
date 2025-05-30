import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { getAllDocuments } from "@/lib/db/documents"
import { getTeacherById } from "@/lib/db/teachers"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const docs = await getAllDocuments()

        // Fetch teacher details for each document and transform the data
        const docsWithTeachers = await Promise.all(
            docs.map(async (doc) => {
                try {
                    let teacher = null
                    if (doc.teacherId) {
                        // Make sure teacherId is a string
                        const teacherId = String(doc.teacherId)

                        try {
                            teacher = await getTeacherById(teacherId)
                        } catch (teacherError) {
                            console.error(`Error fetching teacher with ID ${teacherId}:`, teacherError)
                        }
                    }

                    return {
                        documentId: doc.documentId || `doc_${Date.now()}`,
                        fileName: doc.fileName || "Untitled",
                        fileSize: doc.fileSize || 0,
                        s3Key: doc.s3Key || "",
                        uploadDate: doc.uploadDate || new Date().toISOString(),
                        description: doc.description || "",
                        subject: doc.subject || "N/A",
                        status: doc.status || "active",
                        teacherId: doc.teacherId || "unknown",
                        teacherName: teacher?.name || "Unknown",
                        teacherEmail: teacher?.email || "Unknown",
                        teacherSubjects: teacher?.subjects?.join(", ") || "None",
                    }
                } catch (error) {
                    console.error("Error processing document:", error, doc)
                    return {
                        documentId: doc.documentId || `doc_${Date.now()}`,
                        fileName: "Error Processing Document",
                        fileSize: 0,
                        s3Key: "",
                        uploadDate: new Date().toISOString(),
                        description: "Error processing document data",
                        subject: "N/A",
                        status: "error",
                        teacherId: "unknown",
                        teacherName: "Unknown",
                        teacherEmail: "Unknown",
                        teacherSubjects: "None",
                    }
                }
            })
        )

        return NextResponse.json(docsWithTeachers)
    } catch (error) {
        console.error("Error fetching documents:", error)
        return new NextResponse(error.message || "Internal Server Error", { status: 500 })
    }
}
