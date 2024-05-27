import { useLayoutEffect, useRef } from "react"

const Audio = ({ srcObject }) => {
    const audioRef = useRef()

    useLayoutEffect(() => {
        audioRef.current.srcObject = srcObject
    }, [srcObject])

    return <audio autoPlay ref={audioRef} playsInline />
}

export default Audio