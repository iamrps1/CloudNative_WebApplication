"use client"

import { useState } from "react"
import { FileText, Trash2, Eye } from "lucide-react"
import { deleteDocument } from "@/lib/db/documents"
import { toast } from "sonner"
import PdfViewer from "./PdfViewer"

export default function DocumentList({ documents, loading, onDocumentDelete }) {
    const [deletingId, setDeletingId] = useState(null)
    const [viewingDoc, setViewingDoc] = useState(null)
    const [loadingUrl, setLoadingUrl] = useState(false)

    const handleView = async (document) => {
        try {
            setLoadingUrl(true)
            const response = await fetch(`/api/documents/signed-url?key=${encodeURIComponent(document.s3Key)}`)
            if (!response.ok) {
                throw new Error("Failed to get document URL")
            }
            const { url } = await response.json()
            setViewingDoc({ ...document, url })
        } catch (error) {
            console.error("Error viewing document:", error)
            toast.error("Failed to open document")
        } finally {
            setLoadingUrl(false)
        }
    }

    const handleDelete = async (teacherId, documentId) => {
        try {
            setDeletingId(documentId)
            await deleteDocument(teacherId, documentId)
            toast.success("Document deleted successfully")
            onDocumentDelete() // Refresh the list
        } catch (error) {
            console.error("Error deleting document:", error)
            toast.error("Failed to delete document")
        } finally {
            setDeletingId(null)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!documents?.length) {
        return (
            <div className="text-center py-8 text-gray-500">No documents found. Upload your first document above.</div>
        )
    }

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {documents.map((doc) => (
                    <div
                        key={doc.documentId}
                        className="p-4 border border-slate-400 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center">
                                <FileText className="h-8 w-8 text-primary mr-3" />
                                <div>
                                    <h3 className="font-medium text-white truncate max-w-[200px]">{doc.fileName}</h3>
                                    <p className="text-sm text-slate-300">
                                        {new Date(doc.uploadDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                onClick={() => handleView(doc)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                disabled={loadingUrl}
                                title="View"
                            >
                                <Eye className={`h-5 w-5 ${loadingUrl ? "animate-spin" : ""}`} />
                            </button>
                            <button
                                onClick={() => handleDelete(doc.teacherId, doc.documentId)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                disabled={deletingId === doc.documentId}
                                title="Delete"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {viewingDoc && <PdfViewer url={viewingDoc.url} onClose={() => setViewingDoc(null)} />}
        </>
    )
}
