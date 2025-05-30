"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileUp, Download, Trash2 } from "lucide-react"

export default function TeacherDocumentsPage() {
    const [documents, setDocuments] = useState([])

    return (
        <div className="py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Teacher Documents</h1>
                <Button className="bg-orange-400 hover:bg-orange-500">
                    <FileUp className="mr-2 h-4 w-4" />
                    Upload Document
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow">
                {documents.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No documents found. Upload a new document to get started.</p>
                    </div>
                ) : (
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Document Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Teacher
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Upload Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {documents.map((doc, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">{doc.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{doc.teacher}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(doc.uploadDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {doc.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Button
                                            variant="ghost"
                                            className="text-blue-400 hover:text-blue-500 mr-2"
                                            title="Download"
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="text-red-400 hover:text-red-500"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
