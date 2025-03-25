"use client"

import { useState, useRef, useEffect } from "react"
import { X, Eraser, Pencil, Download } from "lucide-react"

export default function PdfViewer({ url, onClose }) {
    const [isDrawing, setIsDrawing] = useState(false)
    const [isDrawMode, setIsDrawMode] = useState(false)
    const canvasRef = useRef(null)
    const contextRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        // Set canvas dimensions
        const resizeCanvas = () => {
            const parent = canvas.parentElement
            canvas.width = parent.offsetWidth
            canvas.height = parent.offsetHeight

            // Configure context
            const context = canvas.getContext("2d")
            context.lineCap = "round"
            context.lineJoin = "round"
            context.strokeStyle = "red"
            context.lineWidth = 3
            contextRef.current = context
        }

        resizeCanvas()

        window.addEventListener("resize", resizeCanvas)
        return () => window.removeEventListener("resize", resizeCanvas)
    }, [])

    const startDrawing = (e) => {
        if (!isDrawMode || !contextRef.current) return

        const canvas = canvasRef.current
        const rect = canvas.getBoundingClientRect()
        const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left
        const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top

        contextRef.current.beginPath()
        contextRef.current.moveTo(x, y)
        setIsDrawing(true)
    }

    const draw = (e) => {
        if (!isDrawing || !isDrawMode || !contextRef.current) return

        e.preventDefault() // Prevent scrolling on touch devices

        const canvas = canvasRef.current
        const rect = canvas.getBoundingClientRect()
        const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left
        const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top

        contextRef.current.lineTo(x, y)
        contextRef.current.stroke()
    }

    const stopDrawing = () => {
        if (!isDrawMode || !contextRef.current) return

        contextRef.current.closePath()
        setIsDrawing(false)
    }

    const clearCanvas = () => {
        if (!contextRef.current) return

        const canvas = canvasRef.current
        contextRef.current.clearRect(0, 0, canvas.width, canvas.height)
    }

    const saveAnnotations = () => {
        if (!canvasRef.current) return

        try {
            const canvas = canvasRef.current
            const image = canvas.toDataURL("image/png")

            // Create download link
            const link = document.createElement("a")
            const fileName = `pdf-annotations-${new Date().toISOString().slice(0, 10)}.png`
            link.href = image
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error("Error saving annotations:", error)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 w-[90%] h-[90%] relative">
                <div className="absolute top-2 right-2 flex space-x-2 z-10">
                    <button
                        onClick={() => setIsDrawMode(!isDrawMode)}
                        className={`p-2 rounded-full ${
                            isDrawMode ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:text-gray-700"
                        }`}
                        title={isDrawMode ? "Drawing mode active" : "Enable drawing"}
                    >
                        <Pencil className="h-5 w-5" />
                    </button>
                    <button
                        onClick={clearCanvas}
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-full"
                        title="Clear annotations"
                        disabled={!isDrawMode}
                    >
                        <Eraser className="h-5 w-5" />
                    </button>
                    <button
                        onClick={saveAnnotations}
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-full"
                        title="Save annotations"
                    >
                        <Download className="h-5 w-5" />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-full"
                        title="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="h-full w-full relative">
                    <iframe src={url} className="w-full h-full" title="PDF Viewer" allow="fullscreen" />
                    <canvas
                        ref={canvasRef}
                        className={`absolute inset-0 w-full h-full ${
                            isDrawMode ? "cursor-crosshair" : "pointer-events-none"
                        }`}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        onTouchCancel={stopDrawing}
                    />
                </div>
            </div>
        </div>
    )
}
