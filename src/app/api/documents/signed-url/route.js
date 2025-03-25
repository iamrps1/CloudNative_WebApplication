import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { getSignedUrl } from "@/lib/s3/upload"

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const s3Key = request.nextUrl.searchParams.get("key")
        if (!s3Key) {
            return new NextResponse("S3 key is required", { status: 400 })
        }

        try {
            const signedUrl = await getSignedUrl(s3Key)
            return NextResponse.json({ url: signedUrl })
        } catch (error) {
            console.error("Error generating signed URL:", error)
            return new NextResponse("Failed to generate download URL", { status: 500 })
        }
    } catch (error) {
        console.error("Error in API route:", error)
        return new NextResponse(error.message || "Internal Server Error", { status: 500 })
    }
}
