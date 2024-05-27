import { useContext, useState } from "react"
import { link } from "../../config.json"
import { AppContext } from "../../app/message"
import Animate from "../../global/animate"

const getdimensions = (width, height) => {
    if (height < 300 && width < 400) return {
        height: height,
        width: width
    }
    if (height >= width) {
        return { height: 300, width: width / height * 300 }
    }
    if (height / width * 400 > 300) return { height: 300, width: width / height * 300 }
    return { width: 400, height: height / width * 400 }
}

const displayURL = (attachment) => {
    const dimensions = getdimensions(attachment.width, attachment.height)
    const query = dimensions.height !== attachment.height && dimensions.width !== attachment.width ?
        `?width=${Math.trunc(dimensions.width)}&height=${Math.trunc(dimensions.height)}` : ""
    return link + attachment.URL + query
}

const Attachment = ({ attachment }) => {
    const { setLayer } = useContext(AppContext)
    const click = () => setLayer(
        <Animate>
            <img className={`view-attachment animated-popup`} src={link + attachment.URL} alt="attachment" />
        </Animate>
    )
    const [bg, setBg] = useState(
        <div className="rotating">
            <div className="rotating-div-1" />
            <div className="rotating-div-2" />
        </div>
    )
    const dimensions = getdimensions(attachment.width, attachment.height)


    if (attachment.fileType !== "image") return null
    return (
        <div className="image-div">
            {bg}
            <img
                onLoad={() => setBg()}
                loading="lazy"
                width={dimensions.width}
                height={dimensions.height}
                src={displayURL(attachment)}
                className="message-attachment"
                alt="attachment"
                onClick={click}
            />
        </div>
    )
}

export default Attachment