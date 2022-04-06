import "./index.css"
import { link } from "../../config.json"
import UserJSX from "./user"
import MemberJSX from "./member"
import Message from "../message"

class User {
    constructor(user) {
        for (const key in user) {
            this[key] = user[key]
        }
        this.id = user._id
    }
    static MapMembers({ members, server, setView, me }) {
        const onlineLength = members.filter(m => m?.online).length, offlineLength = members.length - onlineLength
        const online = [<h5 className="members-title" key="online">ONLINE — {onlineLength}</h5>],
            offline = [<h5 className="members-title" key="offline">OFFLINE — {offlineLength}</h5>]
        const sortedMembers = members.sort((a, b) => a.username.localeCompare(b.username))
        for (const member of sortedMembers) {
            const Member = new User(Object.assign(member, { view: setView }))
            const jsx = <MemberJSX member={Member} key={Member.id} server={server} me={me} />
            if (member.online) online.push(jsx)
            else offline.push(jsx)
        }
        if (offline.length === 1) offline.length = 0
        if (online.length === 1) online.length = 0
        return online.concat(offline)
    }
    displayAvatarURL(size) {
        return `${link + this.avatarURL}${size ? `?width=${size}&height=${size}` : ""}`
    }
    toJSX(style, server, setView) {
        return <UserJSX user={this} setView={setView} style={style} server={server} />
    }
    async fetch() {
        const response = await fetch(`${link}fetch/${this.id}`).then(res => res.json())
        this.avatarURL = response.avatarURL
        this.username = response.username
        return new User(Object.assign({ _id: this.id }, response))
    }
    async edit(username, data, profileColor) {
        const edit = await fetch(`${link}user/edit`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: this.token
            },
            body: JSON.stringify({ username, data, profileColor })
        }).then(res => res.json())
            .catch(console.log)

        this.avatarURL = edit.avatarURL
        this.username = edit.username
        return edit
    }
    async send(message) {
        const msg = await fetch(`${link}dm/${this.id}`, {
            method: "POST",
            headers: {
                Authorization: message.author.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: message.content,
                attachment: message.attachment
            })
        })
            .then(res => res.json())
        return new Message(msg)
    }
}

export default User