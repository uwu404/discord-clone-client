import Hashtag from "../../assets/hashtag"
import VoiceIcon from "../../assets/voice"

const ChannelIcon = ({ type, size }) => {
    switch (type) {
        case "text": return <Hashtag size={size} />
        case "voice": return <VoiceIcon size={size} />
        default: return <Hashtag size={size} />
    }
}

export default ChannelIcon