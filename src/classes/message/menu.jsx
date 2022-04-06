import { useRef, useContext, useState, useLayoutEffect } from "react"
import Utils from "../../utils"
import Delete from "./delete-message"
import { ScreenContext } from "../../app/message"

const Menu = ({ style, message, clickOut, edit }) => {
    const { user: me, setView } = useContext(ScreenContext)
    const [top, setTop] = useState(style.top)
    const divRef = useRef()
    useLayoutEffect(() => {
        const viewportOffset = divRef.current.getBoundingClientRect();
        if (style.top > window.innerHeight - viewportOffset.height - 10) setTop(window.innerHeight - viewportOffset.height - 10)
        if (style.top < 10) setTop(10)
    }, [style.top])
    const deleteE = () => {
        clickOut()
        setView(<Delete onCancel={() => setView()} message={message} />)
    }
    const copyID = () => {
        navigator.clipboard.writeText(message.id)
        clickOut()
    }
    const editMessage = () => {
        clickOut()
        edit(deleteE)
    }
    const readMessage = () => {
        if ('speechSynthesis' in window) {
            const audio = new SpeechSynthesisUtterance()
            audio.text = `${message.author.username} said ${message.content}`
            speechSynthesis.speak(audio)
        }
        clickOut()
    }
    return (
        <Utils.Out click={clickOut}>
            <div ref={divRef} style={{ ...style, top }} className="message-menu">
                {me._id === message.author.id && <div onClick={editMessage} className="editor option">Edit</div>}
                <div onClick={deleteE} className="deletor option">Delete</div>
                <div className="option" onClick={readMessage}>Speak Message</div>
                <div className="option" onClick={copyID}>Copy ID</div>
            </div>
        </Utils.Out>
    )
}

export default Menu