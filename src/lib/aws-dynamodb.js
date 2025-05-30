import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { PutCommand } from "@aws-sdk/lib-dynamodb"
import { v4 as uuidv4 } from "uuid"

const dynamo = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
})

export async function saveAssignmentToDynamoDB({ departmentId, subjectId, teacherId, fileUrl, fileName }) {
    const item = {
        id: uuidv4(),
        departmentId,
        subjectId,
        teacherId,
        fileUrl,
        fileName,
        assignedAt: new Date().toISOString(),
        status: "pending",
    }
    await dynamo.send(
        new PutCommand({
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: item,
        })
    )
    return item
}
