import { useEffect, useMemo, useRef, useState } from "react"
import "./imageCropper.css"

const ImageCropper = ({ src, onChange }) => {
    const canvasRef = useRef()
    const rangeRef = useRef()
    const lastPoint = { x: 0, y: 0 }
    const [size, setSize] = useState([0, 0, 1])
    const speed = 0.7
    const canvasSize = useMemo(() => ({ width: 568, height: 361 }), [])
    let coordinates = useMemo(() => [0, 0], [])
    let isDragging = false
    const calculator = () => ((rangeRef.current.value / 100) + 10) * size[2] * speed
    const hoverListener = (e) => {
        if (!isDragging) return
        if (e.clientX > lastPoint.x) coordinates[0] += calculator()
        if (e.clientX < lastPoint.x) coordinates[0] -= calculator()
        if (e.clientY > lastPoint.y) coordinates[1] += calculator()
        if (e.clientY < lastPoint.y) coordinates[1] -= calculator()
        lastPoint.y = e.clientY
        lastPoint.x = e.clientX
    }
    useEffect(() => {
        let isMounted = true
        const img = new Image()
        const canvas = canvasRef.current
        img.onload = () => {
            const maxSize = Math.min(img.width, img.height)
            const imgToSize = maxSize / canvasSize.height
            canvas.height = canvasSize.height * imgToSize
            canvas.width = canvasSize.width * imgToSize
            if (isMounted) setSize([img.width / imgToSize, img.height / imgToSize, imgToSize])
            const ctx = canvas.getContext("2d")
            const draw = () => {
                if (!canvas || !rangeRef.current) return
                const factor = rangeRef.current.value / 100
                const x = img.width - (img.width * factor)
                const y = img.height - (img.height * factor)
                const radius = maxSize / 2
                const limitX = img.width / 2 - radius
                const limitY = img.height / 2 - radius
                const minX = Math.min(coordinates[0], limitX + (img.width * (factor - 1)))
                const maxX = minX * -1 < limitX ? minX : limitX * -1
                coordinates[0] = maxX
                const minY = Math.min(coordinates[1], limitY + (img.height * (factor - 1)))
                const maxY = minY * -1 < limitY ? minY : limitY * -1
                coordinates[1] = maxY
                const position = [x + maxX + (canvas.width - img.width) / 2, y + maxY + (canvas.height - img.height) / 2]
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.beginPath()
                ctx.drawImage(img, position[0], position[1], img.width * factor + 1, img.height * factor + 1)
                onChange(canvas)
                requestAnimationFrame(draw)
            }
            draw()
        }
        img.src = src
        return () => isMounted = false
    }, [src, coordinates, onChange, canvasSize])

    const handleMouseDown = () => isDragging = true
    const handleMouseUp = () => isDragging = false

    return (
        <>
            <div className="cropper">
                <canvas style={{ background: "black", ...canvasSize }} onMouseOut={handleMouseUp} onMouseUp={handleMouseUp} onMouseDown={handleMouseDown} onMouseMove={hoverListener} ref={canvasRef}></canvas>
                <div style={{ width: Math.min(size[0], size[1]), height: Math.min(size[0], size[1]) }} className="circle-border"></div>
            </div>
            <input className="zoom-range" defaultValue={100} ref={rangeRef} max={200} min={100} type="range" />
        </>
    )
}

export default ImageCropper