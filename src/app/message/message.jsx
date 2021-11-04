import { useEffect, useState, useRef } from "react"
import Channel from "../../classes/channel"
import User, { usersCache } from "../../classes/user"
import Message from "../../classes/message"
import Utils from "../../utils"
import ImagePreview from "../../classes/message/imagePreview"
import Plus from "../../icons/plus"
import { socket } from "."

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const img = new Image()
        img.onload = () => resolve(reader.result);
        img.src = reader.result
    }
    reader.onerror = error => reject(error);
});

const Main = ({ user, server, update, onJoin }) => {
    const [view, setView] = useState()
    const me = new User(Object.assign(user, { view: setView, update }))
    const scroller = useRef()
    const chat = useRef()
    const [channel, setChannel] = useState()
    const [messages, setMessages] = useState()
    const [members, setMembers] = useState([])
    const click = async (ch) => {
        if (channel.id !== ch.id) setChannel(ch)
    }
    const scroll = () => {
        const container = chat.current
        if (Utils.isScolled(scroller.current, container)) {
            setTimeout(() => scroller.current?.scrollIntoView(false), 1)
        }
    }
    useEffect(() => {
        let isMounted = true
        setMessages()
        const ch = new Channel(server.channels[0], server)
        setChannel(ch)
        setMembers([])
        server.fetchMembers("no-cache").then(members => {
            if (isMounted) setMembers(members)
        })
        socket.on("online", id => {
            if (!isMounted) return
            if (usersCache[id]) usersCache[id].online = true
            setMembers(members => {
                const list = [...members]
                const member = list.find(m => m._id === id)
                if (member) member.online = true
                return list
            })
        })
        socket.on("offline", id => {
            if (!isMounted) return
            if (usersCache[id]) usersCache[id].online = false
            setMembers(members => {
                const list = [...members]
                const member = list.find(m => m._id === id)
                if (member) member.online = false
                return list
            })
        })
        return () => {
            socket.off("offline").off("online")
            isMounted = false
        }
    }, [server, me.token])

    useEffect(() => {
        if (!channel) return
        let isMounted = true
        setMessages()
        channel.join(socket, me.token)
        channel.fetchMessages(me.token)
            .then(({ messages }) => {
                if (isMounted) setMessages(messages)
                scroller.current?.scrollIntoView(false)
            })
        socket.on("message", msg => {
            if (!isMounted || msg.author._id === me.id) return
            new Channel({ _id: msg.channel }).push(msg)
            if (channel.id !== msg.channel) return
            scroll()
            setMessages(prev => [...prev, msg])
        })
        socket.on("messageDelete", msg => {
            if (!isMounted) return
            if (msg.channel === channel.id) setMessages(prev => [...prev].filter(m => m._id !== msg._id))
            new Channel({ _id: msg.channel }).deleteMessage(msg)
        })
        return () => {
            isMounted = false
            socket.off("message").off("messageDelete")
        }
    }, [channel, me.id, me.token])


    const send = (message, m) => {
        setMessages(prev => [...prev, m])
        channel.send(message)
            .then(msg => {
                const update = Object.assign(m, { _id: msg.id, unsent: false, invite: msg.invite, content: msg.content })
                if (msg.attachment?.URL) update.attachment = msg.attachment
                scroll()
                setMessages(prev => {
                    const allMessages = [...prev]
                    const find = allMessages.find(ms => ms._id === m._id)
                    allMessages[allMessages.indexOf(find)] = update
                    return allMessages
                })
                update.author.online = msg.author.online
                channel.push(update)
            })
            .catch((err) => {
                console.error(err)
                setMessages(prev => {
                    const list = [...prev]
                    const find = list.find(ms => ms._id === m._id)
                    find.failed = true
                    return list
                })
            })
    }
    const sendMessage = (k) => {
        if (k.code !== "Enter") return
        if (k.target.textContent.length === 0) return 
        k.preventDefault();
        if (!k.target.textContent) return
        const message = { author: user, content: k.target.textContent, _id: `m${Date.now()}`, timestamp: Date.now(), unsent: true, channel: channel.id }
        k.target.textContent = ""
        scroll()
        send(message, message)
    }
    const sendImage = (base64str) => {
        if (!base64str) return
        const cancelHandler = () => {
            setView(<ImagePreview onSend={onSend} channel={channel} animation="smaller" src={base64str} onCancel={cancelHandler} />)
            setTimeout(() => setView(), 100)
        }
        const onSend = (content) => {
            const message = { author: user, content: "uploading...", _id: `m${Date.now()}`, timestamp: Date.now(), unsent: true, channel: channel.id }
            scroll()
            send({ author: me, attachment: base64str, content }, message)
            cancelHandler()
        }
        setView(<ImagePreview onSend={onSend} channel={channel} animation="bigger" src={base64str} onCancel={cancelHandler} />)
    }
    const getImageFromInput = async (e) => {
        const base64str = await toBase64(e.target.files[0]).catch(() => 0)
        if (!base64str) return
        sendImage(base64str)
        e.target.value = ""
    }
    const getImageFromPaste = async (e) => {
        if (navigator.userAgent.indexOf("Firefox") !== -1) {
            e.preventDefault()
            const text = e.clipboardData.getData("text")
            e.target.textContent += text
        }
        const items = e.clipboardData.items
        const file = items[1]?.getAsFile();
        const base64str = await toBase64(file).catch(() => 0)
        sendImage(base64str)
    }

    return (
        <div>
            {view}
            <div className="server-name">
                <span>{server.name}</span>
            </div>
            <div className="channels">
                <div style={{ marginBottom: 10 }}/>
                {Channel.LoadChannels(server?.channels || [], server, click)}
            </div>
            <div className="messages">
                <div className="name">{channel?.toTitle()}</div>
                <main className="messages-main">
                    <div ref={chat} className="chat">
                        {messages && <Message.Map server={server} onJoin={onJoin} me={user} messages={messages} setView={setView} setMessages={setMessages} />}
                        <div ref={scroller} className="scroller" />
                    </div>
                    <div className="controll">
                        <div placeholder={`Send a message to ${channel?.name}`} onPaste={getImageFromPaste} onKeyDown={sendMessage}
                            contentEditable={navigator.userAgent.indexOf("Firefox") !== -1 ? "true" : "plaintext-only"} className="not-input"></div>
                        <div className="attach-file">
                            <input type="file" onChange={getImageFromInput} />
                            <Plus size={12} />
                        </div>
                    </div>
                </main>
                <div className="users">
                    <div className="members">
                        <User.MapMembers me={user} setView={setView} members={members} server={server} />
                    </div>
                </div>
            </div>
            {me.toIcon()}
        </div>
    )
}


export default Main