import { useState } from "react"
import Utils from "../../utils"

const ImagePreview = ({ src, onCancel, onSend, animation, channel, name }) => {
    const [value, setValue] = useState()
    const change = (e) => setValue(e.target.value)

    return (
        <div className={`dark-div ${animation}`}>
            <Utils.Out click={onCancel}>
                <div className={`image-preview ${animation}`}>
                    <img className="image-preview-img" src={src} alt="base64 preview" />
                    <p className="file-name">{name || "image"}</p>
                    <p className="to-channel">Upload to {channel?.name}</p>
                    <label htmlFor="comment" className="add-comment">Add a comment</label>
                    <input name="comment" onChange={change}/>
                    <div style={{ position: "relative", height: "70px", borderBottomRightRadius: "7px", borderBottomLeftRadius: "7px" }} className="create-server">
                        <button onClick={() => onSend(value)} className="create-server-button send-attachment">Send</button>
                        <button style={{ color: "var(--font-primary)" }} onClick={onCancel} className="create-server-button cancel-creating">Cancel</button>
                    </div>
                </div>
            </Utils.Out>
        </div>
    )
}

export default ImagePreview