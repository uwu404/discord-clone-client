const VideoAttachment = ({ message }) => {
    if (message.attachment?.type !== "video") return null
    return <video src={message.attachment.URL} height={message.calculateImage.height} width={message.calculateImage.width}></video>
}

export default VideoAttachment