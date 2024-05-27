import User from "../user"
import "./index.css"
import { link } from "../../config.json"

const formatDate = (date) => {
    try {
        const formatter = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" })
        const time = formatter.format(date)
        const now = new Date()
        const ms = now.getHours() * 3600000 + now.getMinutes() * 60000 + now.getSeconds() * 1000 + now.getMilliseconds()
        const day = 8.64e+7
        if (Date.now() - date.getTime() <= ms) return `Today at ${time}`
        if (Date.now() - date.getTime() <= (ms + day)) return `Yesterday at ${time}`
        return date.toLocaleDateString()
    } catch {
        return "idk when"
    }
}

class Message {
    constructor(message) {
        this.author = new User(message.author)
        this.content = message.content
        this.attachments = message.attachments
        this.createdAt = formatDate(new Date(message.createdAt))
        this.id = message._id
        this.invite = message.invite
        this.unsent = message.unsent
        this.channel = message.channel
        this.failed = message.failed
        this.updatedAt = message.updatedAt
        this.edited = message.updatedAt !== message.createdAt
        this.timestamp = new Date(message.createdAt)
    }
    async delete(token) {
        const message = await fetch(`${link}channels/${this.channel}/messages/${this.id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
        return message
    }
    async edit(content, token) {
        const message = await fetch(`${link}channels/${this.channel}/messages/${this.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        })
            .then(res => res.json())
        return message
    }
    get inviteCode() {
        const invite = this.content.match(/(^|\s)server\/.{8}(?=\s|$)/g)?.[0]
        if (!invite) return null
        return invite.split("/")[1]
    }
}

export default Message