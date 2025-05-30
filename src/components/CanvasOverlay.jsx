import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react"

const CanvasOverlay = forwardRef(function CanvasOverlay(
    { width, height, initialImage, isDrawMode, isEraserMode, drawColor = "red", eraserColor = "#fff" },
    ref
) {
    const canvasRef = useRef(null)
    const contextRef = useRef(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [strokes, setStrokes] = useState([]) // {points: [{x, y}], color, width}
    const [redoStack, setRedoStack] = useState([])
    const currentStroke = useRef(null)

    // Redraw all strokes
    const redraw = (allStrokes = strokes) => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        ctx.clearRect(0, 0, width, height)
        if (initialImage) {
            const img = new window.Image()
            img.onload = () => ctx.drawImage(img, 0, 0, width, height)
            img.src = initialImage
        }
        allStrokes.forEach((stroke) => {
            if (!stroke || !stroke.points || !stroke.points.length) return
            ctx.strokeStyle = stroke.color
            ctx.lineWidth = stroke.width
            ctx.lineCap = "round"
            ctx.lineJoin = "round"
            ctx.beginPath()
            ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
            for (let i = 1; i < stroke.points.length; i++) {
                ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
            }
            ctx.stroke()
        })
    }

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        canvas.width = width
        canvas.height = height
        contextRef.current = canvas.getContext("2d")
        redraw()
        // eslint-disable-next-line
    }, [width, height, initialImage])

    useEffect(() => {
        redraw()
        // eslint-disable-next-line
    }, [strokes])

    useImperativeHandle(ref, () => ({
        getImage: () => {
            if (!canvasRef.current) return null
            return canvasRef.current.toDataURL("image/png")
        },
        clear: () => {
            setStrokes([])
            setRedoStack([])
        },
        undo: () => {
            setStrokes((prev) => {
                if (prev.length === 0) return prev
                setRedoStack((r) => [prev[prev.length - 1], ...r])
                return prev.slice(0, -1)
            })
        },
        redo: () => {
            setRedoStack((prev) => {
                if (prev.length === 0) return prev
                setStrokes((s) => [...s, prev[0]])
                return prev.slice(1)
            })
        },
    }))

    const getPos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect()
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
        return { x, y }
    }

    const startDrawing = (e) => {
        if (!isDrawMode || !contextRef.current) return
        setRedoStack([])
        const color = isEraserMode ? eraserColor : drawColor
        const width = 3
        const { x, y } = getPos(e)
        currentStroke.current = { points: [{ x, y }], color, width }
        setIsDrawing(true)
    }

    const draw = (e) => {
        if (!isDrawing || !isDrawMode || !contextRef.current) return
        e.preventDefault()
        const { x, y } = getPos(e)
        currentStroke.current.points.push({ x, y })
        redraw([...strokes, currentStroke.current])
    }

    const stopDrawing = () => {
        if (!isDrawMode || !contextRef.current) return
        setIsDrawing(false)
        if (currentStroke.current && currentStroke.current.points.length > 1) {
            const newStrokes = [...strokes, currentStroke.current]
            setStrokes(newStrokes)
            redraw(newStrokes)
        }
        currentStroke.current = null
    }

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className={`absolute top-0 left-0 w-full h-full ${isDrawMode ? "cursor-crosshair" : "pointer-events-none"}`}
            style={{ pointerEvents: isDrawMode ? "auto" : "none" }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            onTouchCancel={stopDrawing}
        />
    )
})

export default CanvasOverlay
