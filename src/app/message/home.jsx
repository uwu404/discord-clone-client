import { useEffect, useLayoutEffect, useState, useCallback, useContext } from "react"
import User from "../../classes/user"
import Plus from "../../icons/plus"
import "./home.css"
import { link } from "../../config.json"
import { ScreenContext, socket } from "."
import SkeletonLoadingMessage from "../../icons/bones"
import Input from "../../global/input"
import Footer from "../../classes/user/footer"
import Messages from "../../classes/message/messagesMapper"
import SearchUsers from "./findConversation/index"
import createMessage from "./sendMessage"
import handleSocketEvents from "./handleSocketEvents"
import PreviousQueries from "../../cache"
import Avatar from "../../global/avatar"
import Attachments from "./attachmentManager"
import toBase64 from "../../global/toBase64"

const Map = ({ users, onClick, type }) => {
    return users.map(u => {
        if (!u) return null
        const user = new User(u)
        return (
            <div key={user.id} className="friend">
                <img width="35" height="35" alt="uwu" src={user.displayAvatarURL(45)} className="friend-pfp" />
                <div>
                    <h5 className="friend-name">{user.username}<span>{user.tag}</span></h5>
                    <p className="state">{type === "requests" && u.received && "Incoming friend request"}</p>
                    <p className="state">{type === "requests" && !u.received && "Ongoing friend request"}</p>
                    <p className="state">{type === "friends" && (!u.online ? "Offline" : "Online")}</p>
                </div>
                {type === "requests" && u.received && <div onClick={() => onClick?.(user)} className="accept"><Plus size={15} /></div>}
                {type === "friends" && <div onClick={() => onClick?.(user)} className="accept">DM</div>}
            </div>
        )
    })
}

const Friends = ({ online, user, click }) => {
    const [friends, setFriends] = useState([])

    useEffect(() => {
        let isMounted = true
        fetch(`${link}friends`, {
            headers: {
                Authorization: user.token
            }
        }).then(res => res.json())
            .then(friends => {
                if (isMounted) setFriends(online ? friends.filter(f => f.online) : friends)
            })
        return () => {
            isMounted = false
            setFriends([])
        }
    }, [user, online])

    return (
        <>
            <h5 className="home-title">{online ? "ONLINE" : "ALL"}—{friends.length}</h5>
            <div className="list">
                <Map onClick={click} type="friends" users={friends} />
            </div>
        </>
    )
}

const Add = ({ user }) => {
    const [value, setValue] = useState("")
    const [text, setText] = useState(<p className="dumb-text-3">You can add a friend by their tag. It's CaSe SeNsiTive!</p>)

    const handleInputChange = (e) => setValue(e.target.value)

    const sendRequest = async () => {
        const [username, tag] = value.split("#")
        if (!username || !tag) return
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
        fetch(`${link}friends/pending`, {
            headers: {
                Authorization: user.token
            }
        }).then(res => res.json())
            .then(requests => {
                if (isMounted) setRequests(requests)
            })
        return () => { isMounted = false }
    }, [user])

    const click = (invite) => {
        setRequests(prev => [...prev].filter(u => u._id !== invite.id))
        fetch(`${link}accept/${invite.id}`, {
            method: "POST",
            headers: { Authorization: user.token }
        })
    }

    return (
        <>
            <h5 className="home-title">PENDING—{requests.length}</h5>
            <div className="list">
                <Map type="requests" onClick={click} users={requests} />
            </div>
        </>
    )
}

const DM = ({ dm, me, onJoin, setLogs }) => {
    const [messages, setMessages] = useState()
    const [attachments, setAttachments] = useState([])
    const [isLoading, setIsLoading] = useState()

    const sendMessage = useCallback((k) => {
        const awaitForMessage = () => {
            const logs = prev => {
                const newOrder = [...prev]
                newOrder.splice(0, 0, newOrder.splice(newOrder.findIndex(u => u._id === dm.user._id), 1)[0]);
                return newOrder
            }
            setLogs(logs);
            PreviousQueries.setLogs(logs)
        }
        createMessage(k, me, new User(dm.user), setMessages, attachments, setAttachments, awaitForMessage)
    }, [dm.user, me, attachments, setLogs])

    useLayoutEffect(() => {
        let isMounted = true
        if (PreviousQueries.channels[dm.user.id]) {
            setMessages(PreviousQueries.channels[dm.user.id])
        } else {
            setMessages()
            fetch(`${link}dm/${dm.user.id}`, {
                headers: { Authorization: me.token }
            }).then(res => res.json())
                .then(messages => {
                    if (!isMounted) return
                    setMessages(messages)
                    PreviousQueries.at("channels", dm.user.id)(messages)
                    setIsLoading()
                })
        }
        const dmEvent = message => {
            if (!isMounted) return
            if (message.channel !== dm.user.id) return
            handleSocketEvents.message(setMessages, message)
        }
        const messageDelete = message => {
            if (!isMounted) return
            if (message.user !== dm.user.id && message.user !== me._id) return
            handleSocketEvents.messageDelete(setMessages, message)
        }
        const messageEdit = message => handleSocketEvents.messageEdit(setMessages, message)
        socket.on("dm", dmEvent)
        socket.on("messageDelete", messageDelete)
        socket.on("messageEdit", messageEdit)
        return () => {
            isMounted = false
            socket.off("dm", dmEvent).off("messageDelete", messageDelete).off("messageEdit", messageEdit)
        }
    }, [me.token, me._id, dm])

    useLayoutEffect(() => {
        if (!messages && !PreviousQueries.channels[dm.user.id]) setIsLoading(<SkeletonLoadingMessage />)
        else setIsLoading(false)
    }, [messages, dm.user.id])

    useEffect(() => {
        if (messages && dm.message?.target.textContent) sendMessage(dm.message)
    }, [messages, dm.message, sendMessage])

    const sendImage = (file) => {
        if (!file.data) return
        setAttachments([file])
    }

    const getImageFromInput = async (e) => {
        const base64str = await toBase64(e.target.files[0]).catch(() => 0)
        sendImage({ data: base64str, fileName: e.target.files[0]?.name })
        e.target.value = ""
    }

    return (
        <>
            <div className="chat">
                {isLoading}
                <ul className="fetched-messages">
                    <div className="dm-start">
                        <img height="85" width="85" className="dm-avatar" alt="icon" src={dm.user.displayAvatarURL(90)} />
                        <h3 className="dm-username">{dm.user.username}</h3>
                        <p className="dumb-text-2">This is the beginning of your direct message history with <span>{dm.user.username}</span></p>
                    </div>
                    {messages && <Messages onJoin={onJoin} setMessages={setMessages} messages={messages} me={me} />}
                </ul>
            </div>
            <form className="send-message">
                <div className="controll">
                    <div className="message-manager">
                        <ul className={`attachment-list ${attachments.length && "has-children"}`}>
                            <Attachments setAttachments={setAttachments} attachments={attachments} />
                        </ul>
                        <div className="text-content">
                            <div className="file">
                                <button className="attach-file">
                                    <input type="file" onChange={getImageFromInput} />
                                    <Plus size={10} />
                                </button>
                            </div>
                            <Input placeholder={`Send a message to ${dm.user.username}`} onKeyDown={sendMessage} />
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

const Home = ({ user, dm, onJoin }) => {
    const { setView } = useContext(ScreenContext)
    const [button, setButton] = useState("online")
    const [Dm, setDm] = useState(dm)
    const [logs, setLogs] = useState(PreviousQueries.logs)
    const clickEvent = (u) => setDm({ user: u })
    const [screen, setScreen] = useState(<Friends click={clickEvent} online={true} user={user} />)

    useEffect(() => {
        if (dm) setDm(dm)
    }, [dm])

    const { not: [notifications, setNotifications] } = useContext(ScreenContext)

    useLayoutEffect(() => {
        if (!Dm?.user.id) return
        if (notifications.find(n => n.user._id === Dm.user.id)) setNotifications(prev => [...prev].filter(n => n.user._id !== Dm.user.id))
        fetch(`${link}notifications?id=${Dm.user.id}`, {
            method: "DELETE",
            headers: {
                Authorization: user.token
            }
        })
            .catch(console.log)
    }, [notifications, setNotifications, Dm?.user.id, user.token])

    useEffect(() => {
        let isMounted = true
        if (PreviousQueries.logs.length) setLogs(PreviousQueries.logs)
        else fetch(`${link}dms/logs`, {
            headers: {
                Authorization: user.token
            }
        }).then(res => res.json())
            .then(logs => {
                if (!isMounted) return
                setLogs(logs)
                PreviousQueries.setLogs(logs)
            })
        const onlineEvent = user => handleSocketEvents.memberOnline(setLogs, user)
        socket.on("online", onlineEvent)
        return () => {
            socket.off("online", onlineEvent)
            isMounted = false
        }
    }, [user])

    useEffect(() => {
        if (Dm) {
            setScreen(<DM setLogs={setLogs} onJoin={onJoin} dm={Dm} me={user} />)
            setButton(Dm.user.id)
            if (!logs.some(u => u._id === Dm.user.id) && !PreviousQueries.logs.some(u => u._id === Dm.user.id)) {
                setLogs(prev => [Dm.user, ...prev])
                PreviousQueries.setLogs(prev => [Dm.user, ...prev])
            }
        }
    }, [Dm, user, onJoin, logs])

    const click = (button) => () => {
        setButton(button)
        if (button === "online") setScreen(<Friends click={clickEvent} online={true} user={user} />)
        if (button === "add") setScreen(<Add user={user} />)
        if (button === "pending") setScreen(<Pending user={user} />)
        if (button === "all") setScreen(<Friends click={clickEvent} user={user} />)
    }

    const getFriends = () => {
        setButton("online")
        setDm()
        setScreen(<Friends click={clickEvent} online={true} user={user} />)
    }

    const makeConversation = () => setView(<SearchUsers clickUser={(user) => setDm({ user })} logs={logs} />)

    return (
        <main className="flexible-container">
            <section className="left-part">
                <header className="server-name home-search">
                    <input onClick={makeConversation} value="Find or start conversation" className="home-search-input generic-input-type-button" type="button" />
                </header>
                <div className="channels">
                    <div onClick={getFriends} className={`friends-click ${!Dm && "friends-clicked"}`}>Friends</div>
                    <h4 className="direct-messages">DIRECT MESSAGES</h4>
                    {logs.map(u => {
                        const user = PreviousQueries.userCache.has(u._id) ? new User(PreviousQueries.userCache.get(u._id)) : new User(u)
                        const click = () => setDm({ user })
                        return (
                            <div onClick={click} key={user.id} style={{ opacity: 1 }} className={`member ${Dm?.user.id === user.id && "member-clicked"} ${!user.online && "member-offline"}`}>
                                <div className="member-avatar">
                                    <Avatar size={32} status={user.online ? "online" : false} src={user.displayAvatarURL(90)} />
                                </div>
                                <div className="nice-div">
                                    <h4 className={`member-name`}>{user.username}</h4>
                                    <p className="is-online">{user.online && user.customStatus}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <Footer setView={setView} />
            </section>
            <section className="messages messages-home">
                <div className={`name name-${button}`}>
                    {!Dm ? <>
                        <h3 className="h3-title">Friends <span>|</span></h3>
                        <div className="home-buttons">
                            <button onClick={click("online")} className="online">Online</button>
                            <button onClick={click("all")} className="all">All</button>
                            <button onClick={click("pending")} className="pending">Pending</button>
                            <button onClick={click("add")} className="add-friend">Add friend</button>
                        </div>
                    </> :
                        <div className="dm-title">
                            <img className="who-am-i-talking-to" height="20" width="20" alt="pfp" src={Dm.user.displayAvatarURL(80)} />
                            <div className="channel-title"><span>{Dm.user.username}</span></div>
                        </div>
                    }</div>
                <div className="messages-main">{screen}</div>
            </section>
        </main>
    )
}

export default Home