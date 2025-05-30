import { useEffect, useRef, useState } from "react"
import CanvasOverlay from "./CanvasOverlay"
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf"

export default function PDFPage({ pdf, pageNumber, isDrawMode, isEraserMode, drawColor, eraserColor, annotationRef }) {
    const [pageSize, setPageSize] = useState({ width: 0, height: 0 })
    const canvasRef = useRef(null)

    useEffect(() => {
        // Set the workerSrc to the public worker file
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"
    }, [])

    useEffect(() => {
        let renderTask = null
        let isMounted = true
        if (!pdf) return

        pdf.getPage(pageNumber).then((page) => {
            const viewport = page.getViewport({ scale: 1.5 })
            const canvas = canvasRef.current
            const context = canvas.getContext("2d")
            canvas.width = viewport.width
            canvas.height = viewport.height
            setPageSize({ width: viewport.width, height: viewport.height })

            const renderContext = {
                canvasContext: context,
                viewport,
            }
            renderTask = page.render(renderContext)
            renderTask.promise.catch(() => {}) // Prevent unhandled rejection
        })

        return () => {
            isMounted = false
            if (renderTask) {
                renderTask.cancel()
            }
        }
    }, [pdf, pageNumber])

    return (
        <div className="relative mb-8" style={{ width: pageSize.width, height: pageSize.height }}>
            <canvas ref={canvasRef} style={{ width: pageSize.width, height: pageSize.height }} />
            {pageSize.width > 0 && pageSize.height > 0 && (
                <CanvasOverlay
                    ref={annotationRef}
                    width={pageSize.width}
                    height={pageSize.height}
                    isDrawMode={isDrawMode}
                    isEraserMode={isEraserMode}
                    drawColor={drawColor}
                    eraserColor={eraserColor}
                />
            )}
        </div>
    )
}
