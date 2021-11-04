import { useEffect, useLayoutEffect, useRef, useState } from "react"
import User, { usersCache } from "../../classes/user"
import Plus from "../../icons/plus"
import "./home.css"
import { link } from "../../config.json"
import { socket } from "."
import Channel from "../../classes/channel"
import Message from "../../classes/message"
import Utils from "../../utils"

export const friendsCache = {
    add(key, users) {
        this[key] = []
        for (const user of users) {
            this[key].push(user._id)
            usersCache[user._id] = user
        }
    },
    push(key, user) {
        if (!this[key]) return
        if (this[key].includes(user._id)) return
        this[key].push(user._id)
        usersCache[user._id] = user
    },
    get(key) {
        if (!this[key]) return null
        const array = []
        for (const id of this[key]) {
            const user = usersCache[id]
            array.push(user)
        }
        return array
    }
}

const Map = ({ users, onClick, type }) => {
    return users.map(u => {
        if (!u) return null
        const user = new User(u)
        return (
            <div key={user.id} className="friend">
                <img width="45" height="45" alt="uwu" src={user.displayAvatarURL(45)} className="friend-pfp" />
                <h5 className="friend-name">{user.username}<span>{user.tag}</span></h5>
                <p className="state">{type === "requests" && u.recieved && "Incoming friend request"}</p>
                <p className="state">{type === "requests" && !u.recieved && "Ongoing friend request"}</p>
                <p className="state">{type === "friends" && (!u.online ? "Offline" : "Online")}</p>
                {type === "requests" && u.recieved && <div onClick={() => onClick?.(user)} className="accept"><Plus size={15} /></div>}
                {type === "friends" && <div onClick={() => onClick?.(user)} className="accept">DM</div>}
            </div>
        )
    })
}

const Friends = ({ online, user, click }) => {
    const [friends, setFriends] = useState([])

    useEffect(() => {
        let isMounted = true
        if (friendsCache.get("all")) {
            setFriends(online ? friendsCache.get("all").filter(f => f?.online) : friendsCache.get("all"))
        } else {
            fetch(`${link}friends`, {
                headers: {
                    Authorization: user.token
                }
            }).then(res => res.json())
                .then(friends => {
                    friendsCache.add("all", friends)
                    if (isMounted) setFriends(online ? friends.filter(f => f.online) : friends)
                })
        }
        return () => { isMounted = false }
    }, [user, online])

    return (
        <div>
            <h5 className="home-title">{online ? "ONLINE" : "ALL"}—{friends.length}</h5>
            <div className="list">
                <Map onClick={click} type="friends" users={friends} />
            </div>
        </div>
    )
}

const Add = ({ user }) => {
    const [value, setValue] = useState("")
    const [text, setText] = useState(<p className="dumb-text-3">You can add a friend by their tag. It's CaSe SeNsiTive!</p>)

    const handleInputChange = (e) => setValue(e.target.value)

    const sendRequest = async () => {
        const [username, tag] = value.split("#")
        const res = await fetch(`${link}users/${username}&${tag}/request`, {
            method: "POST",
            headers: {
                Authorization: user.token,
                "Content-Type": "application/json"
            }
        })

        if (res.ok) {
            return setText(<p style={{ color: "var(--green)" }} className="dumb-text-3">You send a friend request to {username + "#" + tag}</p>)
        }

        setText(<p style={{ color: "var(--red)" }} className="dumb-text-3">Failed to send a friend request to {username + "#" + tag}</p>)
    }

    return (
        <div className="invite">
            <h3 className="h3-add">ADD FRIEND</h3>
            {text}
            <div className="add-friend-input">
                <input autoComplete="off" maxLength="35" onChange={handleInputChange} placeholder="Enter a username#0000" />
                <div className="fake-after">{!value.includes("#") && value}</div>
                <button onClick={sendRequest} className={`send-friend-request ${value && "valid"}`}>Send friend request</button>
            </div>
        </div>
    )
}

const Pending = ({ user }) => {
    const [requests, setRequests] = useState([])

    useEffect(() => {
        let isMounted = true
        if (friendsCache.pending) {
            setRequests(friendsCache.pending)
        } else {
            fetch(`${link}friends/pending`, {
                headers: {
                    Authorization: user.token
                }
            }).then(res => res.json())
                .then(requests => {
                    friendsCache.pending = requests
                    if (isMounted) setRequests(requests)
                })
        }
        return () => { isMounted = false }
    }, [user])

    const click = (invite) => {
        setRequests(prev => [...prev].filter(u => u._id !== invite.id))
        friendsCache.push("all", invite)
        fetch(`${link}accept/${invite.id}`, {
            method: "POST",
            headers: { Authorization: user.token }
        })
    }

    return (
        <div>
            <h5 className="home-title">PENDING—{requests.length}</h5>
            <div className="list">
                <Map type="requests" onClick={click} users={requests} />
            </div>
        </div>
    )
}

const DM = ({ user, me, setView, onJoin }) => {

    const [messages, setMessages] = useState([])
    const chat = useRef(), scroller = useRef()

    const scroll = () => {
        const container = chat.current
        if (Utils.isScolled(scroller.current, container)) {
            setTimeout(() => scroller.current?.scrollIntoView(false), 1)
        }
    }

    const sendMessage = (k) => {
        if (k.code !== "Enter") return
        const content = k.target.textContent
        if (content.length === 0) return
        k.preventDefault()
        const message = { author: me, content: k.target.textContent, _id: `m${Date.now() + Math.random()}`, timestamp: Date.now(), unsent: true, failed: false, channel: user.id }
        scroll()
        setMessages(prev => [...prev, message])
        k.target.textContent = ""
        fetch(`${link}dm/${user.id}`, {
            method: "POST",
            headers: {
                Authorization: me.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: content
            })
        }).then(res => res.json())
            .then(msg => {
                setMessages(prev => {
                    const list = [...prev]
                    const m = list.find(m => m._id === message._id)
                    m._id = msg._id
                    m.unsent = false
                    return list
                })
            })
            .catch((err) => {
                console.error(err)
                setMessages(prev => {
                    const list = [...prev]
                    const m = list.find(m => m._id === message._id)
                    m.failed = true
                    return list
                })
            })
    }

    useEffect(() => {
        let isMounted = true
        fetch(`${link}dm/${user.id}`, {
            headers: { Authorization: me.token }
        }).then(res => res.json())
            .then(messages => {
                if (isMounted) setMessages(messages)
                scroller.current?.scrollIntoView(false)
            })
        socket.on("dm", message => {
            if (!isMounted) return
            if (message.channel !== user.id) return
            scroll()
            setMessages(prev => [...prev, message])
        })
        socket.on("messageDelete", message => {
            if (!isMounted) return
            if (message.channel !== user.id || message.channel !== me._id) return
            setMessages(prev => [...prev].filter(m => m._id !== message._id))
        })
        return () => {
            isMounted = false
            socket.off("dm")
        }
    }, [me, user])

    return (
        <div>
            <div ref={chat} className="chat">
                <div className="dm-start">
                    <img height="85" width="85" className="dm-avatar" alt="icon" src={user.displayAvatarURL(90)} />
                    <h3 className="dm-username">{user.username}</h3>
                    <p className="dumb-text-2">This is the beginning of your direct message history with <span>{user.username}</span></p>
                </div>
                <Message.Map onJoin={onJoin} setView={setView} setMessages={setMessages} messages={messages} me={me} />
                <div ref={scroller} className="scroller" />
            </div>
            <div className="controll">
                <div onKeyDown={sendMessage} placeholder={`Send a message to ${user.username}`}
                    contentEditable={navigator.userAgent.indexOf("Firefox") !== -1 ? "true" : "plaintext-only"} className="not-input"></div>
                <div className="attach-file">
                    <input type="file" />
                    <Plus size={12} />
                </div>
            </div>
        </div>
    )
}

const Home = ({ user, update, dm, onJoin }) => {
    const [view, setView] = useState()
    const me = new User(Object.assign(user, { view: setView, update }))
    const [button, setButton] = useState("online")
    const [Dm, setDm] = useState(dm)
    const [logs, setLogs] = useState([])
    const clickEvent = (u) => setDm(u)
    const [screen, setScreen] = useState(<Friends online={true} user={user} />)

    useLayoutEffect(() => {
        fetch(`${link}dms/logs`, {
            headers: {
                Authorization: user.token
            }
        }).then(res => res.json())
            .then(logs => {
                setLogs(logs)
            })
    }, [user])

    useEffect(() => {
        let isMounted = true
        if (Dm) {
            setScreen(<DM onJoin={onJoin} user={Dm} me={user} setView={setView} />)
            setButton(Dm.id)
        }
        socket.on("message", msg => {
            if (!isMounted) return
            new Channel({ _id: msg.channel }).push(msg)
        })
        socket.on("online", id => {
            if (!isMounted) return
            if (usersCache[id]) usersCache[id].online = true
        })
        socket.on("offline", id => {
            if (!isMounted) return
            if (usersCache[id]) usersCache[id].online = false
        })
        return () => {
            socket.off('message').off("offline").off("online")
            isMounted = false
        }
    }, [Dm, user, onJoin])

    const click = (button) => () => {
        setButton(button)
        if (button === "online") setScreen(<Friends click={clickEvent} online={true} user={user} />)
        if (button === "add") setScreen(<Add user={user} />)
        if (button === "pending") setScreen(<Pending user={user} />)
        if (button === "all") setScreen(<Friends click={clickEvent} user={user} />)
    }

    return (
        <div>
            <div className="messages">
                <div className={`name name-${button}`}>
                    <button onClick={click("online")} className="online">Online</button>
                    <button onClick={click("all")} className="all">All</button>
                    <button onClick={click("pending")} className="pending">Pending</button>
                    <button onClick={click("add")} className="add-friend">Add friend</button>
                </div>
                <div className="server-name"></div>
                <div className="channels">
                    {logs.map(u => {
                        const user = new User(u)
                        const click = () => setDm(user)
                        return (
                            <div onClick={click} key={user.id} className={`member ${Dm?.id === user.id && "member-clicked"} ${!user.online && "member-offline"}`}>
                                <img width="38" height="38" src={user.displayAvatarURL(90)} alt="avatar" className={`member-icon`} />
                                <div className="nice-div">
                                    <h4 className={`member-name`}>{user.username}</h4>
                                    <p className="is-online">{user.online ? "Online" : "Offline"}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="wrapper">
                    {screen}
                </div>
            </div>
            <div>{me.toIcon()}</div>
            {view}
        </div>
    )
}

export default Home