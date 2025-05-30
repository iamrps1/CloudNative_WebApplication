import { useEffect, useRef, useState } from "react"
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf"
import PDFPage from "./PDFPage"
import ScorePanel from "./ScorePanel"
import { PDFDocument } from "pdf-lib"
import { toast } from "sonner"

const QUESTIONS = [
    { text: "Write a short note on Data Structures.", max: 5 },
    { text: "Explain the concept of normalization in DBMS.", max: 10 },
    { text: "Describe the OSI model in Computer Networks.", max: 8 },
    { text: "What is Big Data? Give examples.", max: 7 },
    { text: "Explain the phases of Software Testing.", max: 10 },
]

const DRAW_COLORS = ["red", "#22d3ee", "#22c55e", "#f59e42", "#fbbf24", "#fff", "#000"]
const ERASER_COLORS = ["#fff", "#000"]

export default function EvaluatorView({ pdfUrl, originalS3Key, onClose }) {
    const [pdf, setPdf] = useState(null)
    const [numPages, setNumPages] = useState(0)
    const [isDrawMode, setIsDrawMode] = useState(false)
    const [isEraserMode, setIsEraserMode] = useState(false)
    const [marks, setMarks] = useState({})
    const [comments, setComments] = useState({})
    const annotationRefs = useRef([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [drawColor, setDrawColor] = useState("red")
    const [eraserColor, setEraserColor] = useState("#fff")
    const [activePage, setActivePage] = useState(0)

    useEffect(() => {
        // Set the workerSrc to the public worker file before loading the PDF
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"
        setLoading(true)
        setError(null)
        pdfjsLib
            .getDocument(pdfUrl)
            .promise.then((doc) => {
                setPdf(doc)
                setNumPages(doc.numPages)
                setLoading(false)
            })
            .catch((err) => {
                setError("Failed to load PDF.")
                setLoading(false)
            })
    }, [pdfUrl])

    const handleMarkChange = (idx, value) => {
        const max = QUESTIONS[idx].max
        let v = value
        if (v === "") v = ""
        else v = Math.max(0, Math.min(Number(v), max))
        setMarks((prev) => ({ ...prev, [idx]: v }))
    }

    const handleCommentChange = (idx, value) => {
        setComments((prev) => ({ ...prev, [idx]: value }))
    }

    const handleFinish = async () => {
        try {
            // Get the original PDF bytes
            const pdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer())
            const pdfDoc = await PDFDocument.load(pdfBytes)

            // For each page, overlay the annotation image if present
            for (let i = 0; i < pdfDoc.getPageCount(); i++) {
                const imgData = annotationRefs.current[i]?.getImage?.()
                if (imgData) {
                    const page = pdfDoc.getPage(i)
                    // Convert data URL to Uint8Array
                    const byteString = atob(imgData.split(",")[1])
                    const byteArray = new Uint8Array(byteString.length)
                    for (let j = 0; j < byteString.length; j++) {
                        byteArray[j] = byteString.charCodeAt(j)
                    }
                    const pngImage = await pdfDoc.embedPng(byteArray)
                    const { width, height } = page.getSize()
                    page.drawImage(pngImage, {
                        x: 0,
                        y: 0,
                        width,
                        height,
                    })
                }
            }

            // Save the annotated PDF
            const newPdfBytes = await pdfDoc.save()
            const blob = new Blob([newPdfBytes], { type: "application/pdf" })

            // Create form data for upload
            const formData = new FormData()
            formData.append("file", blob, "annotated.pdf")
            formData.append("originalS3Key", originalS3Key)
            formData.append("marks", JSON.stringify(marks))
            formData.append("comments", JSON.stringify(comments))

            // Upload to API endpoint
            const response = await fetch("/api/documents/save-evaluation", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                throw new Error("Failed to save evaluation")
            }

            const result = await response.json()
            if (result.success) {
                toast.success("Evaluation saved successfully!")
                onClose()
            } else {
                throw new Error(result.message || "Failed to save evaluation")
            }
        } catch (error) {
            console.error("Error saving evaluation:", error)
            alert("Failed to save evaluation: " + error.message)
        }
    }

    const handleSave = () => {
        // Collect annotation images
        const annotationImages = annotationRefs.current.map((ref) => ref?.getImage?.() || null)
        const data = {
            annotations: annotationImages,
            marks,
            comments,
        }
        // Download as JSON
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `evaluation-${Date.now()}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const handleExportPDF = async () => {
        try {
            // Fetch the original PDF as bytes
            const pdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer())
            const pdfDoc = await PDFDocument.load(pdfBytes)
            // For each page, overlay the annotation image if present
            for (let i = 0; i < pdfDoc.getPageCount(); i++) {
                const imgData = annotationRefs.current[i]?.getImage?.()
                if (imgData) {
                    const page = pdfDoc.getPage(i)
                    // Convert data URL to Uint8Array
                    const byteString = atob(imgData.split(",")[1])
                    const byteArray = new Uint8Array(byteString.length)
                    for (let j = 0; j < byteString.length; j++) {
                        byteArray[j] = byteString.charCodeAt(j)
                    }
                    const pngImage = await pdfDoc.embedPng(byteArray)
                    const { width, height } = page.getSize()
                    page.drawImage(pngImage, {
                        x: 0,
                        y: 0,
                        width,
                        height,
                    })
                }
            }
            const newPdfBytes = await pdfDoc.save()
            // Download the new PDF
            const blob = new Blob([newPdfBytes], { type: "application/pdf" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `annotated-evaluation-${Date.now()}.pdf`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        } catch (err) {
            alert("Failed to export annotated PDF: " + err.message)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[95vw] h-[95vh] flex overflow-hidden relative">
                {/* Left: PDF Pages */}
                <div className="flex-1 h-full overflow-y-auto p-6 relative bg-gray-50">
                    <div className="absolute top-2 left-2 z-10 flex gap-2 items-center">
                        <button
                            onClick={() => setIsDrawMode((d) => !d)}
                            className={`px-3 py-1 rounded ${
                                isDrawMode ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                            }`}
                        >
                            {isDrawMode ? "Drawing: ON" : "Enable Drawing"}
                        </button>
                        {isDrawMode && (
                            <>
                                <button
                                    onClick={() => setIsEraserMode((e) => !e)}
                                    className={`px-3 py-1 rounded ${
                                        isEraserMode ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"
                                    }`}
                                >
                                    {isEraserMode ? "Eraser: ON" : "Eraser"}
                                </button>
                                {!isEraserMode && (
                                    <div className="flex items-center gap-1 ml-2">
                                        {DRAW_COLORS.map((color) => (
                                            <button
                                                key={color}
                                                className={`w-6 h-6 rounded-full border-2 ${
                                                    drawColor === color ? "border-blue-500" : "border-gray-300"
                                                }`}
                                                style={{ background: color }}
                                                onClick={() => setDrawColor(color)}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                )}
                                {isEraserMode && (
                                    <div className="flex items-center gap-1 ml-2">
                                        {ERASER_COLORS.map((color) => (
                                            <button
                                                key={color}
                                                className={`w-6 h-6 rounded-full border-2 ${
                                                    eraserColor === color ? "border-blue-500" : "border-gray-300"
                                                }`}
                                                style={{ background: color }}
                                                onClick={() => setEraserColor(color)}
                                                title={color === "#fff" ? "White Eraser" : "Black Eraser"}
                                            />
                                        ))}
                                    </div>
                                )}
                                <button
                                    className="ml-2 px-2 py-1 rounded bg-gray-200 text-gray-700"
                                    onClick={() => annotationRefs.current[activePage]?.undo?.()}
                                    title="Undo"
                                >
                                    ⟲
                                </button>
                                <button
                                    className="ml-1 px-2 py-1 rounded bg-gray-200 text-gray-700"
                                    onClick={() => annotationRefs.current[activePage]?.redo?.()}
                                    title="Redo"
                                >
                                    ⟳
                                </button>
                                <button
                                    className="ml-1 px-2 py-1 rounded bg-gray-200 text-gray-700"
                                    onClick={() => annotationRefs.current[activePage]?.clear?.()}
                                    title="Clear"
                                >
                                    🗑️
                                </button>
                            </>
                        )}
                        <button onClick={onClose} className="px-3 py-1 rounded bg-gray-200 text-gray-700">
                            Close
                        </button>
                    </div>
                    {loading && <div className="text-center mt-20 text-gray-500">Loading PDF...</div>}
                    {error && <div className="text-center mt-20 text-red-500">{error}</div>}
                    {pdf &&
                        Array.from({ length: numPages }, (_, i) => (
                            <div key={i} onMouseEnter={() => setActivePage(i)} onTouchStart={() => setActivePage(i)}>
                                <PDFPage
                                    pdf={pdf}
                                    pageNumber={i + 1}
                                    isDrawMode={isDrawMode}
                                    isEraserMode={isEraserMode}
                                    drawColor={drawColor}
                                    eraserColor={eraserColor}
                                    annotationRef={(el) => (annotationRefs.current[i] = el)}
                                />
                            </div>
                        ))}
                </div>
                {/* Right: Scoring Sidebar */}
                <ScorePanel
                    questions={QUESTIONS.map((q) => q.text)}
                    maxMarks={QUESTIONS.map((q) => q.max)}
                    marks={marks}
                    comments={comments}
                    onCommentChange={handleCommentChange}
                    onMarkChange={handleMarkChange}
                    onFinish={handleFinish}
                    onSave={handleSave}
                    onExportPDF={handleExportPDF}
                />
            </div>
        </div>
    )
}
