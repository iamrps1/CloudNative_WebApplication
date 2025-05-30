"use client"
import { useState, useRef } from "react"
import { Upload } from "lucide-react"
import { toast } from "sonner"

export default function UploadStep({ department, subject, teacher, onReset }) {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [success, setSuccess] = useState(false)
    const [uploadedUrl, setUploadedUrl] = useState("")
    const fileInputRef = useRef(null)

    // Defensive: don't render if any are missing
    if (!department || !subject || !teacher) {
        return <div className="text-red-500">Missing selection. Please complete all steps.</div>
    }

    const handleFileUpload = async (event) => {
        const file = event.target.files[0]
        if (!file || file.type !== "application/pdf") {
            toast.error("Please select a PDF file")
            return
        }

        try {
            setUploading(true)
            setProgress(10)

            const formData = new FormData()
            formData.append("file", file)
            formData.append("departmentId", department.id)
            formData.append("subjectId", subject.id)
            formData.append("subject", subject.name)
            formData.append("teacherId", teacher.id)

            // Use XMLHttpRequest for progress
            const xhr = new XMLHttpRequest()
            xhr.open("POST", "/api/assign-document", true)
            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    setProgress(Math.round((e.loaded / e.total) * 100))
                }
            }
            xhr.onload = () => {
                setUploading(false)
                setProgress(0)
                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText)
                    if (data.success) {
                        toast.success(data.message)
                        setSuccess(true)
                        setUploadedUrl(data.fileUrl)
                        if (fileInputRef.current) fileInputRef.current.value = ""
                    } else {
                        toast.error("Failed to assign document")
                    }
                } else {
                    toast.error("Failed to assign document")
                }
            }
            xhr.onerror = () => {
                setUploading(false)
                setProgress(0)
                toast.error("Failed to assign document")
            }
            xhr.send(formData)
        } catch (error) {
            setUploading(false)
            setProgress(0)
            toast.error("Failed to assign document")
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
                        ref={fileInputRef}
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
            {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded mt-4">
                    <p className="text-green-700 font-semibold mb-2">Document assigned successfully!</p>
                    <button type="button" className="ml-4 bg-accent text-white px-4 py-2 rounded" onClick={onReset}>
                        Assign Another
                    </button>
                </div>
            )}
        </div>
    )
}
