import createBlob from "../../../global/createBlob"
import Plus from "../../../icons/plus"
import "./index.css"

const Attachments = ({ attachments, setAttachments }) => {
    const deleteAttachment = index => setAttachments(prev => [...prev].filter((_, i) => i !== index))
    return attachments.map(({ data, fileName }, i) => {
        const blob = createBlob(data.split(",")[1], "image/" + fileName.split(".").pop())
        const url = URL.createObjectURL(blob)
        return (
            <li className="attachment-item" key={i} style={{ position: "relative" }}>
                <button onClick={() => deleteAttachment(i)} className="attachment-delete"><Plus size={15} /></button>
                <img src={url} className="attachment-2" alt="attachment" />
                <span className="attachment-name">{fileName}</span>
            </li>
        )
    })
}

export default Attachments