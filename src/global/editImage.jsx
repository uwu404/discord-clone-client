import { useRef, useState } from "react"
import ImageCropper from "./imageCropper"
import "./editImage.css"
import Animate from "./animate"

const SubComponent = ({ src, onComplete }) => {
    const [data, setData] = useState()
    const cancelButton = useRef()

    const complete = () => {
        onComplete(data.toDataURL("image/webp"))
    }
    
    const skip = () => onComplete(src)

    return (
        <Animate element={cancelButton}>
            <div className="edit-image animated-popup">
                <h2>Edit Image</h2>
                <ImageCropper style={{ maxHeight: 400, maxWidth: 400 }} onChange={setData} src={src} />
                <div className="lower-section">
                    <button style={{ marginLeft: 10 }} onClick={skip} className="skip generic-button cancel">Skip</button>
                    <button ref={cancelButton} style={{ marginLeft: "auto" }} className="edit-image-cancel generic-button cancel">Cancel</button>
                    <button style={{ marginRight: 1 }} onClick={complete} className="edit-image-complete generic-button primary">Apply</button>
                </div>
            </div>
        </Animate>
    )
}

export default SubComponent