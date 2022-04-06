import { useEffect, useState, createContext } from "react"
import Server from "../../classes/server"
import "./index.css"
import Main from "./message"
import { link } from "../../config.json"
import { io } from "socket.io-client"
import Home from "./home"
import HomeIcon from "../../icons/home"
import Login from "../login"
import User from "../../classes/user"
import "../genericstyles.css"
import Add from "../../classes/server/addServer"
import UserSettings from "../../classes/user/user-settings"
import PreviousQueries from "../../cache"
import Masks from "../masks"

export const ScreenContext = createContext()
export const socket = io(link, { transports: ['websocket', 'polling', 'flashsocket'] })

const notificationSound = new Audio("/notification.mp3")

const Message = ({ user: me, update, dm }) => {
    const [showSettings, setShowSettings] = useState(false)
    const [user, setUser] = useState(me)
    const [server, setServer] = useState()
    user.notifications?.forEach(n => n.saved = true)
    const [notifications, setNotifications] = useState(user.notifications || [])
    const [servers, setServers] = useState(user.servers)

    useEffect(() => {
        socket.connect()
        socket.emit("online", me.token)
        socket.on("disconnect", () => {
            update(<Login update={update} />)
        })
        socket.on("notification", (notification) => {
            notificationSound.play()
            if (notification.type === "dm") setNotifications(prev => [...prev, notification])
        })
        socket.on("leave", (server) => {
            setServer()
            setUser(prev => Object.assign(prev, { servers: [...prev.servers].filter(s => s._id !== `${server._id}`) }))
            setServers(prev => [...prev].filter(s => s._id !== `${server._id}`))
        })
        socket.on("channelCreate", (channel) => {
            setServers(prev => {
                const servers = [...prev]
                const server = servers.find(s => s._id === channel.server)
                server.channels.push(channel)
                return servers
            })
        })
        const init = PreviousQueries.init()
        return () => {
            init()
            socket.off("disconnect").off("notification").off("channelCreate")
            socket.disconnect()
            PreviousQueries.clear()
        }
    }, [me, update])

    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light")
    const [screen, setScreen] = useState(<Home user={user} update={update} />)
    const click = (s) => {
        if (server?.id === s.id) return
        setServer(s)
    }
    const handlenewServer = (user, server) => {
        user.servers.push(server)
        setServers(user.servers)
        const s = new Server(server, user)
        setServer(s)
    }
    const create = (server) => handlenewServer(user, server)
    const [view, setView] = useState()

    useEffect(() => {
        const join = (server) => handlenewServer(user, server)
        if (server) setScreen(<Main socket={socket} onJoin={join} update={update} server={server} user={user} />)
        else setScreen(<Home onJoin={join} dm={dm} user={user} update={update} />)
        socket.on("serverUpdate", server => {
            setServers(prev => {
                const servers = [...prev]
                const sv = servers.find(s => s._id === server._id.toString())
                sv.icon = server.icon
                sv.name = server.name
                return servers
            })
        })
        return () => socket.off("serverUpdate")
    }, [server, update, user, dm])

    const homeClick = () => server && setServer()

    const index = () => {
        const iserver = user.servers.find(s => s._id === server?.id)
        return user.servers.indexOf(iserver)
    }

    const providerValue = { setScreen, setServer, setUser, not: [notifications, setNotifications], user, setTheme, setView, setShowSettings }

    return (
        <ScreenContext.Provider value={providerValue}>
            <div className={`platform ${showSettings && "is-showing-settings"} ${theme}`}>
                {view}
                {(showSettings || (showSettings === "")) && <UserSettings user={new User(user)} />}
                <div className="screen">
                    <nav className="navigate">
                        <div style={{ marginTop: 10, marginBottom: 3 }} className={`server-block ${!server && "clicked"}`}>
                            <div title="Home" className="server">
                                <div onClick={homeClick} className={`home-button server-icon ${!server && "isclicked"}`}><HomeIcon /></div>
                            </div>
                            <div className="server-marker" />
                        </div>
                        {notifications.map((n, i) => {
                            const u = new User(n.user)
                            if (notifications.findIndex(not => not.user._id === u.id) !== i) return null
                            const dm = () => {
                                setServer()
                                setScreen(<Home onJoin={server => create(user, server)} update={update} dm={{ user: u }} user={user} />)
                            }
                            return (
                                <div key={u.id} className="server-block">
                                    <div className={`server nt ${!n.saved && "nta"}`}>
                                        <img onClick={dm} width="48" height="48" alt="icon" src={u.displayAvatarURL(90)} className="server-icon" />
                                        <div className="notification">{notifications.filter(not => not.user._id === u.id).length}</div>
                                    </div>
                                    <div className="server-marker" />
                                </div>
                            )
                        })}
                        <div className="border-bottom" />
                        <Server.LoadServers index={index()} me={user} servers={servers} click={click} isHome={!server} />
                        <Add user={user} onCreate={create} view={setView} />
                    </nav>
                    {screen}
                </div>
            </div>
            <Masks />
        </ScreenContext.Provider>
    )
}

export default Message