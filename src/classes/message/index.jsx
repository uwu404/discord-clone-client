import User from "../user"
import "./index.css"
import { link } from "../../config.json"

const formatDate = (date) => {
    const minutes = `${`${date.getHours()}`.padStart(2, '0')}:${`${date.getMinutes()}`.padStart(2, '0')}`
    const now = new Date()
    const ms = now.getHours() * 3600000 + now.getMinutes() * 60000 + now.getSeconds() * 1000 + now.getMilliseconds()
    const day = 8.64e+7
    if (Date.now() - date.getTime() <= ms) return `Today at ${minutes}`
    if (Date.now() - date.getTime() <= (ms + day)) return `Yesterday at ${minutes}`
    return date.toLocaleDateString()
}

class Message {
    constructor(message, me, onJoin, server) {
        this.author = new User(message.author)
        this.content = message.content
        this.attachment = message.attachment
        this.timestamp = new Date(message.createdAt)
        this.createdAt = formatDate(new Date(message.createdAt))
        this.id = message._id
        this.invite = message.invite
        this.unsent = message.unsent
        this.server = server
        this.channel = message.channel
        this.Authorization = me?.token
        this.me = me
        this.setMessages = message.setMessages
        this.onJoin = onJoin
        this.failed = message.failed
        this.updatedAt = message.updatedAt
    }
    get calculateImage() {
        if (this.attachment.height < 300 && this.attachment.width < 400) return {
            height: this.attachment.height,
            width: this.attachment.width
        }
        if (this.attachment.height >= this.attachment.width) {
            return { height: 300, width: this.attachment.width / this.attachment.height * 300 }
        }
        if (this.attachment.height / this.attachment.width * 400 > 300) return { height: 300, width: this.attachment.width / this.attachment.height * 300 }
        return { width: 400, height: this.attachment.height / this.attachment.width * 400 }
    }
    get displayAttachmentURL() {
        const query = this.calculateImage.height !== this.attachment.height && this.calculateImage.width !== this.attachment.width ?
            `?width=${Math.trunc(this.calculateImage.width)}&height=${Math.trunc(this.calculateImage.height)}` : ""
        return link + this.attachment.URL + query
    }
    async delete() {
        const message = await fetch(`${link}channels/${this.channel}/messages/${this.id}`, {
            method: "DELETE",
            headers: {
                Authorization: this.Authorization
            }
        })
            .then(res => res.json())
        return message
    }
    async edit(content) {
        const message = await fetch(`${link}channels/${this.channel}/messages/${this.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: this.Authorization
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