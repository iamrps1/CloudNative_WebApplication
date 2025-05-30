import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { S3Client } from "@aws-sdk/client-s3"
import { PutCommand } from "@aws-sdk/lib-dynamodb"
import { v4 as uuidv4 } from "uuid"

// AWS Configuration
const config = {
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
}

// Initialize DynamoDB
const ddbClient = new DynamoDBClient(config)
export const dynamoDb = DynamoDBDocumentClient.from(ddbClient)

// Initialize S3
export const s3Client = new S3Client(config)

// S3 bucket name
export const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME

// DynamoDB table names
export const TABLES = {
    DOCUMENTS: "teacher_documents",
    TEACHERS: "teachers",
}

export async function saveAssignmentToDynamoDB({
    departmentId,
    subjectId,
    teacherId,
    subject,
    fileSize,
    fileName,
    s3Key,
}) {
    const documentId = `doc_${Date.now()}`
    const item = {
        PK: `TEACHER#${teacherId}`,
        SK: `DOC#${uuidv4()}`,
        documentId,
        departmentId,
        subjectId,
        teacherId,
        subject,
        description: `Uploaded for ${subject}`,
        fileSize,
        fileName,
        fileType: "application/pdf",
        s3Key,
        uploadDate: new Date().toISOString(),
        status: "active",
    }
    await dynamoDb.send(
        new PutCommand({
            TableName: TABLES.DOCUMENTS,
            Item: item,
        })
    )
    return item
}
