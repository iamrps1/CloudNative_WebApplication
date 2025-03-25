"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import { uploadToS3 } from "@/lib/s3/upload"
import { createDocument } from "@/lib/db/documents"
import { toast } from "sonner"

export default function FileUpload({ teacherId, onUploadSuccess }) {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)

    const handleFileUpload = async (event) => {
        const file = event.target.files[0]
        if (!file || file.type !== "application/pdf") {
            toast.error("Please select a PDF file")
            return
        }

        try {
            setUploading(true)
            // Generate a unique key for S3
            const key = `documents/${teacherId}/${Date.now()}-${file.name}`

            // Upload to S3 with progress tracking
            const s3Response = await uploadToS3({
                file,
                key,
                onProgress: (percent) => setProgress(percent),
            })

            // Save document info to DynamoDB
            await createDocument({
                teacherId,
                fileName: file.name,
                fileSize: file.size,
                s3Key: key,
                description: "Uploaded document",
            })

            toast.success("File uploaded successfully!")
            onUploadSuccess?.() // Call the callback if provided
            // Reset form
            event.target.value = ""
        } catch (error) {
            console.error("Upload error:", error)
            toast.error("Failed to upload file")
        } finally {
            setUploading(false)
            setProgress(0)
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="mt-4">
                <label
                    htmlFor="file-upload"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer 
                    ${uploading ? "bg-gray-100 border-gray-300" : "border-primary hover:bg-gray-50"}`}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF files only</p>
                    </div>
                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        disabled={uploading}
                    />
                </label>
            </div>

            {uploading && (
                <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-primary h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-500 text-center mt-2">Uploading... {progress}%</p>
                </div>
            )}
        </div>
    )
}
