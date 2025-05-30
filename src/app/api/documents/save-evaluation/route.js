import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { uploadToS3 } from "@/lib/s3/upload"
import { dynamoDb, TABLES } from "@/lib/aws-config"
import { PutCommand } from "@aws-sdk/lib-dynamodb"

export const config = {
    api: {
        bodyParser: false,
    },
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get("file")
        const originalS3Key = formData.get("originalS3Key")
        const marks = JSON.parse(formData.get("marks"))
        const comments = JSON.parse(formData.get("comments"))

        if (!file || !originalS3Key) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        console.log("Original S3 key:", originalS3Key)

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload to S3 with the same key (overwriting the original)
        console.log("Uploading to S3 with key:", originalS3Key)
        try {
            const uploadResult = await uploadToS3({
                file: buffer,
                key: originalS3Key,
                contentType: "application/pdf",
                fileName: "annotated.pdf",
            })
            console.log("S3 upload result:", uploadResult)
        } catch (uploadError) {
            console.error("S3 upload error:", uploadError)
            throw new Error(`Failed to upload to S3: ${uploadError.message}`)
        }

        // Update DynamoDB record with evaluation data
        const evaluationId = `eval_${Date.now()}`
        const item = {
            PK: `EVAL#${evaluationId}`,
            SK: `DOC#${originalS3Key}`,
            evaluationId,
            documentKey: originalS3Key,
            marks,
            comments,
            evaluatedAt: new Date().toISOString(),
            evaluatedBy: session.user.id,
        }

        try {
            await dynamoDb.send(
                new PutCommand({
                    TableName: TABLES.DOCUMENTS,
                    Item: item,
                })
            )
        } catch (dbError) {
            console.error("DynamoDB error:", dbError)
            throw new Error(`Failed to save evaluation data: ${dbError.message}`)
        }

        return NextResponse.json({
            success: true,
            message: "Evaluation saved successfully",
            evaluationId,
        })
    } catch (error) {
        console.error("Error saving evaluation:", error)
        return new NextResponse(error.message || "Internal Server Error", { status: 500 })
    }
}
