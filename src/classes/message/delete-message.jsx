import Animate from "../../app/animate"
import MessageJSX from "./message"

const MessageDelete = ({ message, onCancel }) => {
    const del = () => {
        message.delete()
        onCancel()
    }
    return (
        <Animate>
            <div className={`dlt animated-popup`}>
                <h2 className="some-text">Delete message</h2>
                <h4 className="dumb-question">Are you sure you want to delete this message?</h4>
                <div className="preview-message"><MessageJSX full={true} message={message} /></div>
                <div className="lower-section">
                    <button onClick={onCancel} className="generic-button cancel">Cancel</button>
                    <button className="generic-button error" onClick={del}>Delete</button>
                </div>
            </div>
        </Animate>
    )
}

export default MessageDelete