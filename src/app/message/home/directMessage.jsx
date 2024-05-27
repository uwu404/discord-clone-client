import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import { UserContext } from ".."
import Messages from "../../../classes/message/messagesMapper"
import Attachments from "../attachments"
import Plus from "../../../assets/plus"
import Input from "../../../global/input"
import { link } from "../../../config.json"
import { dropFile, getImageFromInput, getImageFromPaste } from "../../../global/getFile"
import PreviousQueries from "../../../cache"

const fetchUserMessages = async (userId, token) => {
    if (PreviousQueries.channels[userId]) return PreviousQueries.channels[userId]

    const messages = await fetch(`${link}dm/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(res => res.json())
    const setMessages = PreviousQueries.at("channels", userId)
    setMessages(messages)
    return messages
}

const sendMessage = async (message, to, token) => {
    const msg = await fetch(`${link}dm/${to}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
    })
        .then(res => res.json())
    return msg
}

const DM = ({ dmUser }) => {
    const { user, socket } = useContext(UserContext)
    const [attachments, setAttachments] = useState([])
    const location = useLocation()
    const dm = useMemo(() => ({ user: dmUser, message: location.state.dm?.message }), [dmUser, location.state.dm?.message])
    const [messages, setMessages] = useState()

    useEffect(() => {
        let isMounted = true

        const handleMessage = (message) => {
            if (message.channel !== dm.user.id) return
            if (message.author._id === user.id) return
            setMessages(prev => [...prev, message])
        }

        const handleMessageDelete = (message) => {
            if (message.channel !== dm.user.id) return
            setMessages(prev => [...prev].filter(m => m._id !== message._id))
        }

        const handleMessageEdit = (message) => {
            if (message.channel !== dm.user.id) return
            setMessages(prev => [...prev].map(m => m._id === message._id ? message : m))
        }

        const getMessages = async () => {
            const dms = await fetchUserMessages(dm.user.id, user.token)
            if (!isMounted) return
            setMessages(dms)
            socket.on("dm", handleMessage)
            socket.on("messageDelete", handleMessageDelete)
            socket.on("messageEdit", handleMessageEdit)
        }

        getMessages()

        return () => {
            isMounted = false
            setMessages()
            socket.off("dm", handleMessage)
                .off("messageDelete", handleMessageDelete)
                .off("messageEdit", handleMessageEdit)
        }
    }, [dm.user.id, user.token, socket, user.id])

    const addAttachment = (file) => {
        if (!file.data) return
        setAttachments(prev => [file, ...prev])
    }

    const dispatchMessage = useCallback(async (content, attachments = []) => {
        setAttachments([])
        const _id = Math.random()
        const message = { content, author: user, _id, attachments: attachments.map(a => a.data), createdAt: Date.now(), unsent: true, updatedAt: Date.now() }
        setMessages(prev => [...prev, message])
        const msg = await sendMessage(message, dm.user.id, user.token)
        setMessages(prev => [...prev].map(m => m._id === message._id ? msg : m))
    }, [user, dm.user.id])

    const handleKeyDown = (e) => {
        if (e.code !== "Enter") return
        if (!e.target.innerText.trim() && !attachments.length) return
        e.preventDefault()
        dispatchMessage(e.target.innerText, attachments)
        e.target.innerText = ""
    }

    return (
        <>
            <div onDragOver={e => e.preventDefault()} onDrop={async e => addAttachment(await dropFile(e))} className="chat stylish-scrollbar">
                <ul className="fetched-messages">
                    <div className="dm-start">
                        <img height="85" width="85" className="dm-avatar" alt="icon" src={dm.user.displayAvatarURL(90)} />
                        <h3 className="dm-username">{dm.user.username}</h3>
                        <p className="dumb-text-2">This is the beginning of your direct message history with <span>{dm.user.username}</span></p>
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
                                    <input type="file" onChange={async e => addAttachment(await getImageFromInput(e))} />
                                    <Plus strokeWidth={4} size={10} />
                                </button>
                            </div>
                            <Input onKeyDown={handleKeyDown} renderId={dm?.user.id} onPaste={async e => addAttachment(await getImageFromPaste(e))} placeholder={`Send a message to ${dm.user.username}`} />
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default DM