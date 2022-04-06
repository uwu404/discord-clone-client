import { useContext, useState } from "react"
import { link } from "../../config.json"
import { ScreenContext } from "../../app/message"
import Animate from "../../app/animate"

const Attachment = ({ message }) => {
    const { setView } = useContext(ScreenContext)
    const click = () => setView(
        <Animate>
            <img className={`view-attachment animated-popup`} src={link + message.attachment.URL} alt="attachment" />
        </Animate>
    )
    const [bg, setBg] = useState(
        <div className="rotating">
            <div className="rotating-div-1" />
            <div className="rotating-div-2" />
        </div>
    )
    if (!message.attachment?.URL) return null
    return (
        <div className="image-div">
            {bg}
            <img onLoad={() => setBg()} loading="lazy" width={message.calculateImage.width} height={message.calculateImage.height} src={message.displayAttachmentURL} className="message-attachment" alt="attachment" onClick={click} />
        </div>
    )
}

export default Attachment