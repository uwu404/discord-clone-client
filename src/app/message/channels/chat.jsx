import { useContext, useEffect, useState } from "react"
import Hashtag from "../../../assets/hashtag"
import Messages from "../../../classes/message/messagesMapper"
import { getImageFromInput, getImageFromPaste } from "../../../global/getFile"
import Input from "../../../global/input"
import Attachments from "../attachments"
import { UserContext } from ".."
import sendMessage from "./sendMessage"
import Plus from "../../../assets/plus"

const Chat = ({ channel }) => {
    const [messages, setMessages] = useState()
    const [attachments, setAttachments] = useState([])
    const { user, socket } = useContext(UserContext)

    useEffect(() => {
        let isMounted = true
        document.title = `React App | ${channel.name}`
        socket.emit("join", { channel: channel.id })

        const messageListener = msg => {
            if (msg.author._id === user.id) return
            if (channel.id !== msg.channel) return
            setMessages(prev => [...prev, msg])
        }

        const messageDeleteListener = msg => {
            if (msg.channel !== channel.id) return
            setMessages(prev => [...prev].filter(m => m._id !== msg._id))
        }

        const editListener = msg => {
            if (msg.channel !== channel.id) return
            setMessages(prev => prev.map(m => m._id === msg._id ? msg : m))
        }

        const getMessages = async () => {
            const messages = await channel.fetchMessages(user.token)
            if (!isMounted) return
            setMessages(messages)
            socket.on("message", messageListener)
            socket.on("messageDelete", messageDeleteListener)
            socket.on("messageEdit", editListener)
        }

        getMessages()

        return () => {
            isMounted = false
            socket.off("message", messageListener)
                .off("messageDelete", messageDeleteListener)
                .off("messageEdit", editListener)
            document.title = "React App"
            setMessages()
        }
    }, [channel, user.id, user.token, socket])

    const dispatchMessage = async (content) => {
        setAttachments([])
        const _id = Math.random()
        const message = { content, author: user, _id, attachments: attachments.map(a => a.data), createdAt: Date.now(), unsent: true, updatedAt: Date.now() }
        setMessages(prev => [...prev, message])
        const msg = await sendMessage(message, channel.id, user.token)
        setMessages(prev => [...prev].map(m => m._id === message._id ? msg : m))
    }

    const handleKeyDown = (e) => {
        if (e.code !== "Enter") return
        if (!e.target.innerText.trim() && !attachments.length) return
        e.preventDefault()
        dispatchMessage(e.target.innerText)
        e.target.innerText = ""
    }

    const addImage = (file) => {
        if (!file.data) return
        setAttachments(prev => [file, ...prev])
    }

    return (
        <div className="messages-main">
            <div className="chat stylish-scrollbar">
                <ul className="fetched-messages">
                    <div className="dm-start">
                        <div className="dm-avatar channel-icon">
                            <Hashtag size="50" />
                            </div>
                        <h3 className="dm-username">{channel?.name}</h3>
                        <p className="dumb-text-2">This is the start of <span>#{channel?.name}</span> message history.</p>
                    </div>
                    <Messages messages={messages} />
                </ul>
            </div>
            <form onSubmit={e => e.preventDefault()} className="send-message">
                <div className="controll">
                    <div className="message-manager">
                        <ul className={`attachment-list ${attachments.length && "has-children"}`}>
                            <Attachments setAttachments={setAttachments} attachments={attachments} />
                        </ul>
                        <div className="text-content">
                            <div className="file">
                                <button className="attach-file">
                                    <input type="file" onChange={async e => addImage(await getImageFromInput(e))} />
                                    <Plus strokeWidth={4} size={10} />
                                </button>
                            </div>
                            <Input renderId={channel?.id} placeholder={`Send a message to ${channel?.name}`} onPaste={async (e) => addImage(await getImageFromPaste(e))} onKeyDown={handleKeyDown} />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Chat