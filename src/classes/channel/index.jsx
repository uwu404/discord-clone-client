import { useEffect, useState } from "react";
import "./index.css";
import { link } from "../../config.json"
import Message from "../message";
import Hashtag from "../../icons/hashtag";
import ChannelJSX from "./channel";
import PreviousQueries from "../../cache";

const components = {
    LoadChannels: (channels, server, click) => {
        const [state, setState] = useState(0)
        useEffect(() => setState(0), [channels])
        const jsx = channels.map((c, i) => {
            const channel = new Channel(c, server)
            return channel.toJSX(state === i, () => {
                click(channel)
                setState(i)
            })
        })
        return jsx
    }
}

class Channel {
    constructor(channel, server) {
        this.name = channel.name
        this.id = channel._id
        this.server = server
    }
    static LoadChannels = components.LoadChannels
    toJSX(isClicked, click) {
        return <ChannelJSX key={this.id} isClicked={isClicked} onClick={click} channel={this} />
    }
    toTitle() {
        return (
            <div className="channel-title">
                <Hashtag size={28} />
                <span>{this.name}</span>
            </div>
        )
    }
    join(socket, token) {
        socket.emit("join", { channel: this.id, Authorization: token })
    }
    async fetchMessages(token) {
        if (PreviousQueries.channels[this.id]) return PreviousQueries.channels[this.id]
        const messages = await fetch(`${link}channels/${this.id}/messages`, {
            headers: { Authorization: token }
        })
            .then(res => res.json())
            .catch(() => [])
        const setMessages = PreviousQueries.at("channels", this.id)
        setMessages(messages.messages)
        return messages.messages
    }
    async send(message) {
        const msg = await fetch(`${link}channels/${this.id}/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: message.author.token
            },
            body: JSON.stringify(message)
        })
            .then(res => res.json())
        return new Message(msg)
    }
}

export default Channel