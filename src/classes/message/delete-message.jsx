import Utils from "../../utils"

const MessageDelete = ({ name, message, onCancel }) => {
    const del = () => {
        message.delete()
        onCancel()
    }
    return (
        <div className={`dark-div ${name}`}>
            <Utils.Out click={onCancel}>
                <div className={`dlt ${name}`}>
                    <h2 className="some-text">Delete message</h2>
                    <h4 className="dumb-question">Are you sure you want to delete this message?</h4>
                    <div className="preview-message">{message.toJSX()}</div>
                    <div style={{ position: "relative", height: "70px" }} className="create-server">
                        <button className="create-server-button delete-message" onClick={del}>Delete</button>
                        <button style={{ color: "var(--font-primary)" }} onClick={onCancel} className="create-server-button cancel-creating">Cancel</button>
                    </div>
                </div>
            </Utils.Out>
        </div>
    )
}

export default MessageDelete