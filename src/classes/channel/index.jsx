import { useEffect, useState } from "react";
import "./index.css";
import { link } from "../../config.json"
import Message from "../message";
import Hashtag from "../../icons/hashtag";
import { usersCache } from "../user";

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

export const messages = {
    cache: {},
    add(key, items) {
        for (const item of items.messages) usersCache[item.author._id] = item.author
        this.cache[key] = items
        const keys = Object.keys(this.cache)
        if (keys.length > 6) delete this.cache[keys[Math.floor(Math.random() * Object.keys.length)]]
    },
    delete(channel, id) {
        if (!this.cache[channel]) return
        const filter = this.cache[channel].messages.filter(m => m?._id !== id)
        this.cache[channel].messages = filter
    },
    get(channel) {
        const cache = this.cache[channel] 
        if (!cache) return null
        for (const message of cache.messages) message.author = usersCache[message.author._id]
        return cache
    },
    clear() {
        this.cache = {}
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
        return (
            <div key={this.id} onClick={click} className={`channel ${isClicked ? "c-clicked" : ""}`}>
                <Hashtag size={25} />
                <span>{this.name}</span>
            </div>
        )
    }
    toTitle() {
        return (
            <div className="channel-title">
                <Hashtag size={30} />
                <span>{this.name}</span>
            </div>
        )
    }
    join(socket, token) {
        socket.emit("join", { channel: this.id, Authorization: token })
    }
    async fetchMessages(token, nocache) {
        const headers = { Authorization: token }
        const cache = messages.get(this.id)
        if (cache && !nocache) return cache
        const Messages = await fetch(`${link}channels/${this.id}/messages`, { headers })
            .then(res => res.json())
            .catch(() => [])
        messages.add(this.id, Messages)
        return Messages
    }
    push(message) {
        if (!messages.cache[this.id]) return
        messages.add(this.id, { to: this.id, messages: [...messages.cache[this.id].messages, message] })
    }
    deleteMessage(message) {
        messages.delete(this.id, message._id)
    }
    add(msgs) {
        messages.add(this.id, { to: this.id, messages: msgs })
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