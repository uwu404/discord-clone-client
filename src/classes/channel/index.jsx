import "./index.css"
import { link } from "../../config.json"
import PreviousQueries from "../../cache"

class Channel {
    constructor(channel, server) {
        this.name = channel.name
        this.id = channel._id
        this.server = server
        this.type = channel.type
    }
    async fetchMessages(token) {
        if (PreviousQueries.channels[this.id]) return PreviousQueries.channels[this.id]
        const messages = await fetch(`${link}channels/${this.id}/messages`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .catch(() => [])
        const setMessages = PreviousQueries.at("channels", this.id)
        setMessages(messages)
        return messages
    }
}

export default Channel