"use client"

import { useState, useEffect } from "react"
import { Upload } from "lucide-react"
import { toast } from "sonner"
import subjects from "@/constants/subjects"

export default function AdminDocumentUpload() {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [selectedSubject, setSelectedSubject] = useState("")
    const [teachers, setTeachers] = useState([])
    const [selectedTeacher, setSelectedTeacher] = useState("")

    // Load teachers when subject is selected
    useEffect(() => {
        if (selectedSubject) {
            loadTeachers(selectedSubject)
        } else {
            setTeachers([])
            setSelectedTeacher("")
        }
    }, [selectedSubject])

    const loadTeachers = async (subject) => {
        try {
            const response = await fetch(`/api/teachers/by-subject?subject=${encodeURIComponent(subject)}`)
            if (!response.ok) {
                const error = await response.text()
                throw new Error(error || "Failed to load teachers")
            }
            const data = await response.json()
            setTeachers(data)
        } catch (error) {
            console.error("Error loading teachers:", error)
            toast.error("Failed to load teachers")
            setTeachers([])
        }
    }

    const handleFileUpload = async (event) => {
        const file = event.target.files[0]
        if (!file || file.type !== "application/pdf") {
            toast.error("Please select a PDF file")
            return
        }

        if (!selectedTeacher) {
            toast.error("Please select a teacher first")
            return
        }

        try {
            setUploading(true)
            setProgress(10)

            const formData = new FormData()
            formData.append("file", file)
            formData.append("teacherId", selectedTeacher)
            formData.append("subject", selectedSubject)

            const response = await fetch("/api/documents/upload", {
                method: "POST",
                body: formData,
            })

            setProgress(50)

            if (!response.ok) {
                const error = await response.text()
                throw new Error(error || "Failed to upload file")
            }

            await response.json() // Wait for the response to complete
            setProgress(100)
            toast.success("File uploaded successfully!")

            // Reset form
            event.target.value = ""
            setSelectedTeacher("")
            setSelectedSubject("")
        } catch (error) {
            console.error("Upload error:", error)
            toast.error(error.message || "Failed to upload file")
        } finally {
            setUploading(false)
            setProgress(0)
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Subject Selection */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Select Subject</label>
                <select
                    className="mt-1 block w-full rounded-md border py-2 px-2 [&>option]:bg-slate-800 [&>option]:text-white bg-transparent shadow-sm focus:border-primary focus:ring-primary"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    disabled={uploading}
                >
                    <option value="">Select a subject...</option>
                    {subjects.map((subject) => (
                        <option key={subject} value={subject}>
                            {subject}
                        </option>
                    ))}
                </select>
            </div>

            {/* Teacher Selection */}
            {selectedSubject && (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Select Teacher</label>
                    <select
                        className="mt-1 block w-full rounded-md border py-2 px-2 [&>option]:bg-slate-800 [&>option]:text-white bg-transparent shadow-sm focus:border-primary focus:ring-primary capitalize"
                        value={selectedTeacher}
                        onChange={(e) => setSelectedTeacher(e.target.value)}
                        disabled={uploading}
                    >
                        <option value="">Select a teacher...</option>
                        {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id} className="capitalize">
                                {teacher.name}
                                {/* ({teacher.subjects.join(", ")}) */}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* File Upload */}
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
                        disabled={uploading || !selectedTeacher}
                    />
                </label>
            </div>

            {/* Upload Progress */}
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
