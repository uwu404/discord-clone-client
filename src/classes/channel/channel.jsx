import TextChannel from "./textChannel"
import VoiceChannel from "./voiceChannel"

const ChannelJSX = ({ channel }) => {
    switch (channel.type) {
        case "text": return <TextChannel channel={channel} />
        case "voice": return <VoiceChannel channel={channel} />
        default: return <TextChannel channel={channel} />
    }
}

export default ChannelJSX