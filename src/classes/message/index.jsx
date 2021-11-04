import User from "../user"
import "./index.css"
import Utils from "../../utils"
import Dots from "../../icons/3dots"
import Delete from "./delete-message"
import { link } from "../../config.json"
import Invite from "./invite"
import { useState } from "react"

const Attachment = ({ message }) => {
    const View = ({ name }) => {
        return (
            <div style={{ pointerEvents: "all" }} className={`darken ${!name && "slide"}`}>
                <Utils.Out click={del}>
                    <img className={`view-attachment ${name}`} src={link + message.attachment.URL} alt="attachment" />
                </Utils.Out>
            </div>
        )
    }
    const del = () => {
        message.setView(<View name="smaller" />)
        setTimeout(() => message.setView(), 100)
    }
    const click = () => {
        message.setView(<View name="bigger" />)
        setTimeout(() => message.setView(<View />), 100)
    }
    const [bg, setBg] = useState(
        <div className="rotating">
            <div className="rotating-div-1" />
            <div className="rotating-div-2" />
        </div>
    )
    return (
        <div className="image-div">
            {bg}
            <img onLoad={() => setBg()} loading="lazy" width={message.calculateImage.width} height={message.calculateImage.height} src={message.displayAttachmentURL} className="message-attachment" alt="attachment" onClick={click} />
        </div>
    )
}

class Message {
    constructor(message, me, onJoin, server) {
        this.author = new User(message.author)
        this.content = message.content
        this.attachment = message.attachment
        this.timestamp = new Date(message.timestamp)
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
    }
    static Map({ messages, setView, setMessages, me, onJoin, server }) {
        const jsx = messages.map((message, i) => {
            const mapped = new Message(Object.assign(message, { setMessages }), me, onJoin, server)
            mapped.getView(setView)
            return (
                mapped.author.id === messages[i - 1]?.author._id && mapped.timestamp - messages[i - 1]?.timestamp < 600000 ?
                    mapped.toJSXMin() : mapped.toJSX()
            )
        })
        return jsx
    }
    getView(setView) {
        this.setView = setView
    }
    toJSX() {
        const click = async (e) => {
            const viewportOffset = e.target.getBoundingClientRect();
            this.setView(
                <Utils.Out click={() => this.setView()}>
                    {this.author.toJSX({
                        left: viewportOffset.left + viewportOffset.width + 7 < window.innerWidth - 275 ? viewportOffset.left + viewportOffset.width + 7 : window.innerWidth - 275,
                        top: viewportOffset.top - 60
                    }, this.server, this.me)}
                </Utils.Out>
            )
        }
        const join = (server) => this.onJoin(server)
        const menu = (e) => {
            const viewportOffset = e.target.getBoundingClientRect();
            const style = {
                top: viewportOffset.top,
                left: viewportOffset.left,
                zIndex: 4
            }
            const out = () => this.setView()
            this.setView(<this.Menu clickOut={out} style={style} message={this} />)
        }
        const message = (
            <div key={this.id} className={`message-div ${this.unsent ? "unsent" : ""}`} style={{ marginTop: "15px" }}>
                <img onClick={click} width="40" height="40" className="author-icon" src={this.author.displayAvatarURL(90)} alt="avatar" />
                <div className="message-content">
                    <p className="author-name"><span onClick={click} className="exact-author">{this.author.username}</span><span className="exact-time">{this.createdAt}</span></p>
                    <p className={`text ${(this.unsent ? "unsent-message " : " ") + (this.failed ? "failed-tosend" : "")}`}>{this.content}</p>
                    {this.attachment?.URL && this.Attachment}
                    {this.invite?._id && <Invite me={this.me} onJoin={join} invite={this.invite} code={this.#inviteCode} />}
                </div>
                <div onClick={menu} tabIndex="0" className="message-params"><Dots size={22} /></div>
            </div>
        )
        return message
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
    get createdAt() {
        const date = this.timestamp
        const today = new Date(Date.now())
        const minutes = `${`${date.getHours()}`.padStart(2, '0')}:${`${date.getMinutes()}`.padStart(2, '0')}`
        if (date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
            if (date.getDay() === today.getDay()) return `Today at ${minutes}`
            if (today.getDay() - date.getDay() === 1) return `Yesterday at ${minutes}`
            return date.toLocaleDateString()
        }
        return date.toLocaleDateString()
    }
    toJSXMin() {
        const join = (server) => this.onJoin(server)
        const menu = (e) => {
            const viewportOffset = e.target.getBoundingClientRect();
            const style = {
                top: viewportOffset.top,
                left: viewportOffset.left,
                zIndex: 4
            }
            const out = () => this.setView()
            this.setView(<this.Menu clickOut={out} style={style} message={this} />)
        }
        return (
            <div style={{ paddingTop: "4px", paddingBottom: "4px" }} className="message-div min" key={this.id}>
                <p className="createdAt">{`${this.timestamp.getHours()}`.padStart(2, '0')}:{`${this.timestamp.getMinutes()}`.padStart(2, '0')}</p>
                <p className={`min-text ${(this.unsent ? "unsent-message " : " ") + (this.failed ? "failed-tosend" : "")}`}>{this.content}</p>
                {this.attachment?.URL && this.Attachment}
                {this.invite?._id && <Invite me={this.me} onJoin={join} invite={this.invite} code={this.#inviteCode} />}
                <div onClick={menu} tabIndex="0" className="message-params"><Dots size={22} /></div>
            </div>
        )
    }
    get Attachment() {
        return <Attachment message={this} />
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
    Menu({ style, message, clickOut }) {
        const deleteD = () => {
            message.setView(<Delete onCancel={deleteD} name="smaller" message={message} />)
            setTimeout(() => message.setView(), 100)
        }
        const deleteE = () => message.setView(<Delete onCancel={deleteD} name="bigger" message={message} />)
        return (
            <Utils.Out click={clickOut}>
                <div style={style} className="message-menu">
                    <p className="editor option">Edit</p>
                    <p onClick={deleteE} className="deletor option">Delete</p>
                </div>
            </Utils.Out>
        )
    }
    get #inviteCode() {
        const invite = this.content.match(/(^|\s)server\/.{7}(?=\s|$)/g)[0]
        return invite.split("/")[1]
    }
}

export default Message