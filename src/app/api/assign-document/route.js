import { uploadFileToS3 } from "@/lib/aws-s3"
import { saveAssignmentToDynamoDB } from "@/lib/aws-config"

export const config = {
    api: {
        bodyParser: false,
    },
}

export async function POST(req) {
    const formData = await req.formData()
    const file = formData.get("file")
    const departmentId = formData.get("departmentId")
    const subjectId = formData.get("subjectId")
    const subject = formData.get("subject")
    const teacherId = formData.get("teacherId")

    if (!file) {
        return Response.json({ success: false, message: "No file uploaded" })
    }

    // Read file as buffer
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = Buffer.from(arrayBuffer)

    // You may need to polyfill Buffer in your environment
    // Upload to S3
    const key = `documents/${teacherId}/${Date.now()}-${file.name}`
    await uploadFileToS3(fileBuffer, file.type, key)

    await saveAssignmentToDynamoDB({
        departmentId,
        subjectId,
        teacherId,
        subject,
        fileSize: file.size,
        fileName: file.name,
        s3Key: key,
    })

    return Response.json({ success: true, message: "Document assigned!" })
}
