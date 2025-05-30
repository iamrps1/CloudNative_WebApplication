import { PutCommand, QueryCommand, GetCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb"
import { dynamoDb, TABLES } from "../aws-config"
import { convertFromDynamoDB } from "@/utils/dynamoDataConvert"
import bcrypt from "bcryptjs"

// Create or update teacher
export async function upsertTeacher({ id, email, name, subjects, status = "active", password }) {
    const timestamp = new Date().toISOString()
    const teacherId = id || `teacher_${Date.now()}`

    // Hash password if provided
    let hashedPassword
    if (password) {
        hashedPassword = await bcrypt.hash(password, 10)
    }

    // If updating an existing teacher, get their current data first
    let existingTeacher = null
    if (id) {
        try {
            const params = {
                TableName: TABLES.TEACHERS,
                Key: {
                    id: teacherId,
                },
            }
            const response = await dynamoDb.send(new GetCommand(params))
            if (response.Item) {
                existingTeacher = response.Item
            }
        } catch (error) {
            console.error("Error fetching existing teacher:", error)
        }
    }

    const params = {
        TableName: TABLES.TEACHERS,
        Item: {
            id: teacherId,
            email,
            name,
            subjects: Array.isArray(subjects) ? subjects : [subjects],
            status,
            role: "teacher", // Set default role as teacher
            createdAt: existingTeacher?.createdAt || timestamp,
            updatedAt: timestamp,
            // Preserve existing password if no new password is provided
            password: hashedPassword || existingTeacher?.password,
        },
    }

    try {
        await dynamoDb.send(new PutCommand(params))
        return params.Item
    } catch (error) {
        console.error("Error creating/updating teacher:", error)
        throw error
    }
}

// FIXME: Later use QueryCommand, not working about There's no Global Secondary Index (GSI) created for the email field
// // Get teacher by email
// export async function getTeacherByEmail(email) {
//     const params = {
//         TableName: TABLES.TEACHERS,
//         IndexName: "email-index",
//         KeyConditionExpression: "email = :email",
//         ExpressionAttributeValues: {
//             ":email": email,
//         },
//     }

//     try {
//         const response = await dynamoDb.send(new QueryCommand(params))
//         const teacher = response.Items?.[0]
//         return teacher ? convertFromDynamoDB(teacher) : null
//     } catch (error) {
//         console.error("Error fetching teacher:", error)
//         throw error
//     }
// }

export async function getTeacherByEmail(email) {
    const params = {
        TableName: TABLES.TEACHERS,
        FilterExpression: "email = :email",
        ExpressionAttributeValues: {
            ":email": email,
        },
    }

    try {
        const response = await dynamoDb.send(new ScanCommand(params))
        const teacher = response.Items?.[0]
        return teacher ? convertFromDynamoDB(teacher) : null
    } catch (error) {
        console.error("Error fetching teacher:", error)
        throw error
    }
}

// Get teachers by subject
export async function getTeachersBySubject(subject) {
    const params = {
        TableName: TABLES.TEACHERS,
        FilterExpression: "contains(subjects, :subject)",
        ExpressionAttributeValues: {
            ":subject": subject,
        },
    }

    try {
        const response = await dynamoDb.send(new ScanCommand(params))
        return response.Items?.map((teacher) => convertFromDynamoDB(teacher)) || []
    } catch (error) {
        console.error("Error fetching teachers by subject:", error)
        throw error
    }
}

// Get all subjects
export async function getAllSubjects() {
    const params = {
        TableName: TABLES.TEACHERS,
        ProjectionExpression: "subjects",
    }

    try {
        const response = await dynamoDb.send(new ScanCommand(params))
        const subjects = new Set()
        response.Items?.forEach((item) => {
            const teacher = convertFromDynamoDB(item)
            if (Array.isArray(teacher.subjects)) {
                teacher.subjects.forEach((subject) => subjects.add(subject))
            }
        })
        return Array.from(subjects).sort()
    } catch (error) {
        console.error("Error fetching subjects:", error)
        throw error
    }
}

// Get teacher by ID
export async function getTeacherById(id) {
    if (!id) {
        console.warn("getTeacherById called with null or undefined id")
        return null
    }

    // Ensure id is a string
    const teacherId = String(id)

    // Use ScanCommand with a filter instead of GetCommand to avoid key schema issues
    const params = {
        TableName: TABLES.TEACHERS,
        FilterExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": teacherId,
        },
    }

    try {
        const response = await dynamoDb.send(new ScanCommand(params))
        const teacher = response.Items?.[0]

        if (!teacher) {
            console.log(`No teacher found with ID: ${teacherId}`)
            return null
        }

        return convertFromDynamoDB(teacher)
    } catch (error) {
        console.error(`Error fetching teacher by ID: ${teacherId}`, error)
        // Return null instead of throwing to prevent API failure
        return null
    }
}

// Update teacher subjects
export async function updateTeacherSubjects(teacherId, subjects) {
    const params = {
        TableName: TABLES.TEACHERS,
        Key: {
            id: teacherId,
        },
        UpdateExpression: "SET subjects = :subjects, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
            ":subjects": Array.isArray(subjects) ? subjects : [subjects],
            ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
    }

    JSON.stringify(params, null, 2)

    try {
        const response = await dynamoDb.send(new UpdateCommand(params))
        return response.Attributes ? convertFromDynamoDB(response.Attributes) : null
    } catch (error) {
        console.error("Error updating teacher subjects:", error)
        throw error
    }
}

// Update teacher's password
export async function updateTeacherPassword(teacherId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    const params = {
        TableName: TABLES.TEACHERS,
        Key: {
            id: teacherId,
        },
        UpdateExpression: "SET password = :password, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
            ":password": hashedPassword,
            ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
    }

    try {
        const response = await dynamoDb.send(new UpdateCommand(params))
        return response.Attributes ? convertFromDynamoDB(response.Attributes) : null
    } catch (error) {
        console.error("Error updating teacher password:", error)
        throw error
    }
}
