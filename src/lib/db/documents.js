import { PutCommand, QueryCommand, GetCommand, DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb"
import { dynamoDb, TABLES, s3Client, BUCKET_NAME } from "../aws-config"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"

// DynamoDB schema for documents:
// Primary Key: PK (teacherId), SK (documentId)
// Attributes: fileName, fileSize, fileType, s3Key, uploadDate, description

export async function createDocument({ teacherId, fileName, fileSize, s3Key, description }) {
    const documentId = `doc_${Date.now()}`
    const timestamp = new Date().toISOString()

    const params = {
        TableName: TABLES.DOCUMENTS,
        Item: {
            PK: `TEACHER#${teacherId}`,
            SK: `DOC#${documentId}`,
            documentId,
            teacherId,
            fileName,
            fileSize,
            fileType: "application/pdf",
            s3Key,
            uploadDate: timestamp,
            description,
            status: "active",
        },
    }

    try {
        await dynamoDb.send(new PutCommand(params))
        return { documentId, ...params.Item }
    } catch (error) {
        console.error("Error creating document:", error)
        throw error
    }
}

// Get all documents (for admin)
export async function getAllDocuments() {
    const params = {
        TableName: TABLES.DOCUMENTS,
    }

    try {
        const response = await dynamoDb.send(new ScanCommand(params))
        return response.Items || []
    } catch (error) {
        console.error("Error fetching all documents:", error)
        throw error
    }
}

// FIXME: This one is also changed from QueryCommand to ScanCommand
export async function getTeacherDocuments(teacherId) {
    const params = {
        TableName: TABLES.DOCUMENTS,
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: {
            ":pk": `TEACHER#${teacherId}`,
        },
        FilterExpression: "PK = :pk",
    }

    try {
        const response = await dynamoDb.send(new ScanCommand(params))
        return response.Items || []
    } catch (error) {
        console.error("Error fetching teacher documents:", error)
        throw error
    }
}

export async function getDocument(teacherId, documentId) {
    const params = {
        TableName: TABLES.DOCUMENTS,
        Key: {
            PK: `TEACHER#${teacherId}`,
            SK: `DOC#${documentId}`,
        },
    }

    try {
        const response = await dynamoDb.send(new GetCommand(params))
        return response.Item
    } catch (error) {
        console.error("Error fetching document:", error)
        throw error
    }
}

export async function deleteDocument(teacherId, documentId) {
    console.log("delete", teacherId, documentId)
    // 1. Get the document to find the S3 key
    // const doc = await getDocument(teacherId, documentId)
    if (!doc) throw new Error("Document not found")

    // 2. Delete from S3
    if (doc.s3Key) {
        try {
            await s3Client.send(
                new DeleteObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: doc.s3Key,
                })
            )
        } catch (err) {
            console.error("Error deleting from S3:", err)
            // Optionally, throw or continue
        }
    }

    // 3. Delete from DynamoDB
    const params = {
        TableName: TABLES.DOCUMENTS,
        Key: {
            PK: `TEACHER#${teacherId}`,
            SK: `DOC#${documentId}`,
        },
    }

    try {
        console.log("Class")
        await dynamoDb.send(new DeleteCommand(params))
        return true
    } catch (error) {
        console.error("Error deleting document:", error)
        throw error
    }
}
