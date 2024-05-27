import { useContext, useRef } from "react"
import Animate from "../../global/animate"
import MessageJSX from "./message"
import { UserContext } from "../../app/message"

const MessageDelete = ({ message, onCancel }) => {
    const { user } = useContext(UserContext)
    const cancelButton = useRef()

    const del = () => {
        message.delete(user.token)
        onCancel()
    }

    return (
        <Animate element={cancelButton}>
            <div className={`dlt animated-popup`}>
                <h2 className="some-text">Delete message</h2>
                <h4 className="dumb-question">Are you sure you want to delete this message?</h4>
                <div className="preview-message"><MessageJSX noClicking full={true} message={message} /></div>
                <div className="lower-section">
                    <button ref={cancelButton} className="generic-button cancel">Cancel</button>
                    <button className="generic-button error" onClick={del}>Delete</button>
                </div>
            </div>
        </Animate>
    )
}

export default MessageDelete