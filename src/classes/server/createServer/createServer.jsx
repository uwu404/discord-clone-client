
import { createContext, useEffect, useRef, useState } from "react"
import Animate from "../../../global/animate"
import "./createServer.css"
import AlreadyHasInvite from "./joinServer"
import YourServer from "./yourServer"
import CustomizeServer from "./customizeServer"
import Plus from "../../../assets/plus"

const Render = ({ elementId }) => {
    switch (elementId) {
        case 0: return <YourServer />
        case 1: return <AlreadyHasInvite />
        case 2: return <CustomizeServer />
        default: return null
    }
}

export const CreateServerContext = createContext()

const CreateServer = () => {
    const [page, setPage] = useState(0)
    const [animation, setAnimation] = useState("")
    const [height, setHeight] = useState(200)
    const container = useRef()
    const cancelButton = useRef()

    const transitionTo = (toPage) => () => {
        const isBackwards = toPage > page
        if (isBackwards) setAnimation("slide")
        else setAnimation("slide-back")
        setTimeout(() => {
            if (isBackwards) setAnimation("slide-reverse")
            else setAnimation("slide-reverse-back")
            setPage(toPage)
        }, 200)
    }

    useEffect(() => {
        setHeight(container.current.offsetHeight)
    }, [page])

    return (
        <Animate element={cancelButton}>
            <div style={{ height }} className={`create-server animated-popup`}>
                <div ref={cancelButton} style={{ color: "gray" }} className="exit">
                    <Plus size={25} />
                </div>
                <div className={animation}>
                    <CreateServerContext.Provider value={transitionTo}>
                        <div ref={container}>
                            <Render elementId={page} />
                        </div>
                    </CreateServerContext.Provider>
                </div>
            </div>
        </Animate>
    )
}

export default CreateServer