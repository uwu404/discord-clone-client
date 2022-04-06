import { useState, useLayoutEffect, useContext } from "react"
import Channel from "../../classes/channel"
import User from "../../classes/user"
import Plus from "../../icons/plus"
import { ScreenContext, socket } from "."
import { link } from "../../config.json"
import SkeletonLoadingMessage from "../../icons/bones"
import MemberLoading from "../../icons/members"
import Down from "../../icons/down"
import Utils from "../../utils"
import InvitePeople from "../../classes/server/invite-people"
import EditServer from "../../classes/server/server-editor"
import CreateChannel from "../../classes/channel/create-channel"
import Input from "../../global/input"
import Footer from "../../classes/user/footer"
import Messages from "../../classes/message/messagesMapper"
import Hashtag from "../../icons/hashtag"
import Animate from "../animate"
import Attachments from "./attachmentManager/"
import createMessage from "./sendMessage"
import handleSocketEvents from "./handleSocketEvents"
import PreviousQueries from "../../cache"
import toBase64 from "../../global/toBase64"

const Main = ({ user, server, onJoin }) => {
    const { setView } = useContext(ScreenContext)
    const me = new User(user)
    const [channel, setChannel] = useState()
    const [messages, setMessages] = useState()
    const [members, setMembers] = useState([])
    const [attachments, setAttachments] = useState([])
    const click = (ch) => {
        if (channel.id !== ch.id) setChannel(ch)
    }
    useLayoutEffect(() => {
        let isMounted = true
        setMessages()
        try {
            const ch = new Channel(server.channels[0], server)
            if (ch) setChannel(ch)
        } catch {
            const ch = new Channel({ name: "unknown" })
            setMessages([])
            setChannel(ch)
        }
        setMembers([])
        const onlineEvent = user => handleSocketEvents.memberOnline(setMembers, user)
        server.fetchMembers("no-cache").then(members => {
            if (!isMounted) return
            setMembers(members)
            socket.on("online", onlineEvent)
        })
        return () => {
            socket.off("online", onlineEvent)
            isMounted = false
        }
    }, [server, me.token])

    useLayoutEffect(() => {
        if (!channel || !channel?.id) return
        let isMounted = true
        if (!PreviousQueries.channels[channel.id]) setMessages()
        channel.join(socket, me.token)
        channel.fetchMessages(me.token)
            .then((messages) => {
                if (isMounted) setMessages(messages)
            })
        const messageListener = msg => {
            if (!isMounted || msg.author._id === me.id) return
            if (channel.id !== msg.channel) return
            handleSocketEvents.message(setMessages, msg)
        }
        const messageDeleteListener = msg => {
            if (!isMounted) return
            if (msg.channel === channel.id) handleSocketEvents.messageDelete(setMessages, msg)
        }
        const editListener = msg => (msg.channel === channel.id) && handleSocketEvents.messageEdit(setMessages, msg)
        const memberUpdateListener = user => handleSocketEvents.memberUpdate(setMembers, setMessages, user)
        socket.on("message", messageListener)
        socket.on("messageDelete", messageDeleteListener)
        socket.on("messageEdit", editListener)
        socket.on("memberUpdate", memberUpdateListener)
        return () => {
            isMounted = false
            socket.off("message", messageListener)
                .off("messageDelete", messageDeleteListener)
                .off("memberUpdate", memberUpdateListener)
                .off("messageEdit", editListener)
        }
    }, [channel, me.id, me.token])


    const sendMessage = (k) => createMessage(k, user, channel, setMessages, attachments, setAttachments)
    const sendImage = (file) => {
        if (!file.data) return
        setAttachments([file])
    }
    const getImageFromInput = async (e) => {
        const base64str = await toBase64(e.target.files[0]).catch(() => 0)
        sendImage({ data: base64str, fileName: e.target.files[0]?.name })
        e.target.value = ""
    }
    const getImageFromPaste = async (e) => {
        const items = e.clipboardData.items
        const file = items[1]?.getAsFile();
        const base64str = await toBase64(file).catch(() => 0)
        sendImage({ data: base64str, fileName: file?.name })
    }
    const dropFile = async (e) => {
        e.stopPropagation()
        e.preventDefault()
        const items = e.dataTransfer.items
        const file = items[0]?.getAsFile();
        const base64str = await toBase64(file).catch(() => 0)
        sendImage({ data: base64str, fileName: file?.name })
    }

    const [skeleton, setSkeleton] = useState()
    useLayoutEffect(() => {
        if (!messages && !PreviousQueries.channels[channel?.id]) {
            setSkeleton(<SkeletonLoadingMessage />)
        }
        else setSkeleton()
    }, [messages, channel])

    const [menu, setMenu] = useState()

    const invite = () => {
        setMenu(false)
        const quit = () => {
            setView(<IP animation="smaller" />)
            setTimeout(() => setView(), 100)
        }
        const IP = ({ animation }) => {
            return (
                <div className={`dark-div ${animation}`}>
                    <Utils.Out click={quit}>
                        <InvitePeople animation={animation} quit={quit} server={server} />
                    </Utils.Out>
                </div>
            )
        }
        setView(<IP animation="bigger" />)
    }
    const leave = () => {
        fetch(`${link}leave/${server.id}`, {
            method: "PATCH",
            headers: {
                Authorization: me.token
            }
        })
    }
    const createNewChannel = () => {
        setMenu(false)
        setView(<CreateChannel server={server} quit={() => setView()} animation="bigger" />)
    }

    const serverSettings = () => {
        setMenu(false)
        const quit = () => {
            setView(<EditServer server={server} quit={quit} animation="smaller" />)
            setTimeout(() => setView(), 100)
        }
        setView(<EditServer server={server} quit={quit} animation="bigger" />)
    }

    const clickMenu = () => {
        setMenu(true)
        setView(
            <Animate quit={() => setMenu(false)} normal type={1}>
                <div className={`server-menu animated-popup`}>
                    {server.owner === user._id && <>
                        <p onClick={serverSettings}>Server Settings</p>
                        <p onClick={createNewChannel}>Create Channel</p></>}
                    <p onClick={invite} className="invite-people">Invite People</p>
                    {server.owner !== user._id && <><div className="separator"></div>
                        <p onClick={leave} className="leave-server">Leave Server</p></>}
                </div>
            </Animate>
        )
    }

    return (
        <main onDragOver={e => e.preventDefault()} onDrop={dropFile} className="flexible-container">
            <section className="left-part">
                <header onClick={clickMenu} className={`server-name ${menu && "server-name-2"}`}>
                    <span>{server.name}</span>
                    <Down size="23" />
                </header>
                {menu}
                <div className="channels">
                    <div style={{ marginBottom: 10 }} />
                    <h4 className="direct-messages">TEXT CHANNELS</h4>
                    {Channel.LoadChannels(server?.channels || [], server, click)}
                </div>
                <Footer setView={setView} />
            </section>
            <section className="messages">
                <div className="name">{channel?.toTitle()}</div>
                <div className="messages-main">
                    <div className="chat">
                        {skeleton}
                        <ul className="fetched-messages">
                            <div className="dm-start">
                                <div className="dm-avatar channel-icon"><Hashtag size="50" /></div>
                                <h3 className="dm-username">{channel?.name}</h3>
                                <p className="dumb-text-2">This is the start of <span>#{channel?.name}</span> message history.</p>
                            </div>
                            {messages && <Messages server={server} onJoin={onJoin} me={user} messages={messages} setView={setView} setMessages={setMessages} />}
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
                                            <input type="file" onChange={getImageFromInput} />
                                            <Plus size={10} />
                                        </button>
                                    </div>
                                    <Input renderId={channel?.id} placeholder={`Send a message to ${channel?.name}`} onPaste={getImageFromPaste} onKeyDown={sendMessage} />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="users">
                    {members.length === 0 &&
                        <div style={{ marginTop: 20 }}>
                            <MemberLoading times={server?.members?.length || 10} />
                        </div>
                    }
                    <User.MapMembers me={user} setView={setView} members={members} server={server} />
                </div>
            </section>
        </main>
    )
}


export default Main