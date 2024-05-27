import { useRef, useContext, useState, useLayoutEffect } from "react"
import Delete from "./deleteMessage"
import { AppContext, UserContext } from "../../app/message"
import Trash from "../../assets/trash"
import OutSideListener from "../../global/outSideListener"

const Menu = ({ style, message, clickOut, edit }) => {
    const { user: me } = useContext(UserContext)
    const { setLayer } = useContext(AppContext)
    const [top, setTop] = useState(style.top)
    const [right, setRight] = useState(style.right)
    const divRef = useRef()

    useLayoutEffect(() => {
        const viewportOffset = divRef.current.getBoundingClientRect();
        if (style.top > window.innerHeight - viewportOffset.height - 10) setTop(window.innerHeight - viewportOffset.height - 10)
        if (style.top < 10) setTop(10)
        setRight(style.right - viewportOffset.width)
    }, [style.top, style.right])

    const deleteMessage = () => {
        clickOut()
        setLayer(<Delete onCancel={() => setLayer()} message={message} />)
    }

    const copyID = () => {
        navigator.clipboard.writeText(message.id)
        clickOut()
    }

    const editMessage = () => {
        clickOut()
        edit(deleteMessage)
    }

    const readMessage = () => {
        if ('speechSynthesis' in window) {
            const audio = new SpeechSynthesisUtterance()
            audio.text = `${message.author.username} said ${message.content}`
            speechSynthesis.speak(audio)
        }
        clickOut()
    }

    const copyMessageLink = () => {
        navigator.clipboard.writeText(window.location.href + "#" + message.id)
        clickOut()
    }

    return (
        <OutSideListener onClick={clickOut}>
            <div>
                <div ref={divRef} style={{ ...style, top, right }} className="message-menu">
                    {me._id === message.author.id && <div onClick={editMessage} className="editor option">Edit</div>}
                    <div onClick={deleteMessage} className="deletor option"><span className="option-text">Delete</span><Trash size={15} /></div>
                    <div className="option" onClick={readMessage}><span className="option-text">Speak Message</span></div>
                    <div className="option" onClick={copyID}>Copy ID</div>
                    <div className="option" onClick={copyMessageLink}>Copy Message Link</div>
                </div>
            </div>
        </OutSideListener>
    )
}

export default Menu