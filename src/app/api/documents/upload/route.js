import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { uploadToS3 } from "@/lib/s3/upload"
import { createDocument } from "@/lib/db/documents"

export const config = {
    api: {
        bodyParser: false,
    },
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get("file")
        const teacherId = formData.get("teacherId")
        const subject = formData.get("subject")

        if (!file || !teacherId || !subject) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate a unique key for S3
        const key = `documents/${teacherId}/${Date.now()}-${file.name}`

        // Upload to S3
        const s3Response = await uploadToS3({
            file: buffer,
            key,
            contentType: file.type,
            fileName: file.name,
        })

        // Save document info to DynamoDB
        const document = await createDocument({
            teacherId,
            fileName: file.name,
            fileSize: file.size,
            s3Key: key,
            description: `Uploaded for ${subject}`,
            subject,
        })

        return NextResponse.json(document)
    } catch (error) {
        console.error("Error uploading document:", error)
        return new NextResponse(error.message || "Internal Server Error", { status: 500 })
    }
}
