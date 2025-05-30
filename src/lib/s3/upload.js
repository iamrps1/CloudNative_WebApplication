import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl as getS3SignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3Client, BUCKET_NAME } from "../aws-config"

export async function uploadToS3({ file, key, contentType, fileName }) {
    try {
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: file,
            ContentType: contentType || "application/pdf",
        })

        const response = await s3Client.send(command)
        return response
    } catch (error) {
        console.error("Error uploading to S3:", error)
        throw error
    }
}

export async function getSignedUrl(key) {
    try {
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        })

        const url = await getS3SignedUrl(s3Client, command, { expiresIn: 3600 }) // URL expires in 1 hour
        return url
    } catch (error) {
        console.error("Error generating signed URL:", error)
        throw error
    }
}
