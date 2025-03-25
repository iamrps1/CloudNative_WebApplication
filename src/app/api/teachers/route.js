import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { upsertTeacher } from "@/lib/db/teachers"
import { ScanCommand } from "@aws-sdk/lib-dynamodb"
import { dynamoDb, TABLES } from "@/lib/aws-config"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const command = new ScanCommand({
            TableName: TABLES.TEACHERS,
        })

        const response = await dynamoDb.send(command)
        return NextResponse.json(response.Items || [])
    } catch (error) {
        console.error("Error fetching teachers:", error)
        return new NextResponse(error.message || "Internal Server Error", { status: 500 })
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const teacherData = await request.json()
        const result = await upsertTeacher(teacherData)
        return NextResponse.json(result)
    } catch (error) {
        console.error("Error creating/updating teacher:", error)
        return new NextResponse(error.message || "Internal Server Error", { status: 500 })
    }
}
