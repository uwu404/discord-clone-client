import { useEffect, useState, createContext, useMemo, useLayoutEffect } from "react"
import Server from "../../classes/server"
import "./index.css"
import Main from "./channels"
import { link } from "../../config.json"
import { io } from "socket.io-client"
import Home from "./home"
import HomeIcon from "../../assets/home"
import User from "../../classes/user"
import "../genericstyles.css"
import Add from "../../classes/server/createServer/"
import UserSettings from "../../classes/user/settings/userSettings"
import PreviousQueries from "../../cache"
import Masks from "../masks"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import useStreaming from "./customHooks/useStreaming"
import AudioObject from "./channels/audio"
import ServerSettings from "../../classes/server/serverSettings/serverSettings"
import useConnections from "./customHooks/useConnections"
import MapServers from "../../classes/server/mapServers"

export const UserContext = createContext()
export const AppContext = createContext()
export const VoiceChatContext = createContext()

const notificationSound = new Audio(`${link}notification.wav`)

const Message = ({ me }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const params = useParams()
    const [showSettings, setShowSettings] = useState(false)
    const [user, setUser] = useState(me)
    const [connection, setConnection] = useState()
    user.notifications?.forEach(n => n.saved = true)
    const [connectionOptions, setConnectionOptions] = useState({ audio: true, video: true })
    const [notifications, setNotifications] = useState(user.notifications || [])
    const [servers, setServers] = useState(user.servers)
    const [layer, setLayer] = useState()

    const server = useMemo(() => {
        if (!servers.find(s => s._id === params.server)) return null
        return new Server(servers.find(s => s._id === params.server), user) || location.state.server
    }, [servers, user, params.server, location])

    const socket = useMemo(() => io(link, {
        transports: ['websocket', 'polling', 'flashsocket'],
        autoConnect: false,
        auth: {
            token: user.token
        }
    }), [user.token])

    const connections = useConnections(user, socket)
    const streams = useStreaming(connection, user, connectionOptions, socket)

    useEffect(() => {
        socket.on("disconnect", () => {
            console.log("socket disconnected")
        })
        socket.connect()
        const init = PreviousQueries.init(socket)
        return () => {
            init()
            socket.off("disconnect")
            PreviousQueries.clear()
            socket.disconnect()
        }
    }, [user.token, socket])

    useEffect(() => {
        socket.on("notification", (notification) => {
            notificationSound.play()
            if (notification.type === "dm") setNotifications(prev => [...prev, notification])
        })
        socket.on("leave", (s) => {
            if (s._id === server?.id) {
                setShowSettings(false)
                setLayer()
                navigate("/channels/@me", { state: { user } })
            }
            setServers(prev => [...prev].filter(se => se._id !== s._id))
        })
        const channelCreate = (channel) => {
            setServers(prev => {
                const servers = [...prev]
                const server = servers.find(s => s._id === channel.server)
                server.channels.push(channel)
                return servers
            })
        }
        const serverJoin = server => {
            setServers([...user.servers, server])
            navigate(`/channels/${server._id}`, { state: { user, server: new Server(server) } })
        }
        socket.on("channelCreate", channelCreate)
        socket.on("serverJoin", serverJoin)
        socket.on("serverUpdate", server => {
            setServers(prev => {
                const servers = [...prev]
                const sv = servers.find(s => s._id === server._id.toString())
                sv.icon = server.icon
                sv.name = server.name
                return servers
            })
        })
        return () => {
            socket.off("notification")
                .off("channelCreate", channelCreate)
                .off("serverJoin", serverJoin)
                .off("leave")
                .off("serverUpdate")
        }
    }, [navigate, user, server, socket])

    useLayoutEffect(() => {
        if (server && !params.channel) navigate(`/channels/${server._id}/${server.channels[0]._id}`, { state: { user } })
    }, [server, user, params.channel, navigate])

    const userContextProvider = useMemo(() => ({ user: new User(user), socket, setUser, servers }), [user, socket, servers])
    const AppContextProvider = useMemo(() => ({ setLayer, setShowSettings }), [])
    const voiceChatContextProvider = useMemo(() => {
        return {
            connections,
            connection,
            setConnection,
            connectionOptions,
            setConnectionOptions
        }
    }, [connection, connections, connectionOptions])

    return (
        <UserContext.Provider value={userContextProvider}>
            <AppContext.Provider value={AppContextProvider}>
                <div className={`platform ${showSettings && "is-showing-settings"}`}>
                    {layer}
                    {(showSettings === "user-settings" || (showSettings === "")) && <UserSettings user={new User(user)} />}
                    {(showSettings === "server-settings" || (showSettings === 0)) && server && <ServerSettings server={server} />}
                    <div className="screen">
                        <nav className="navigate">
                            <div style={{ marginTop: 12, marginBottom: 3 }} className={`server-block ${!server && "clicked"}`}>
                                <div onClick={() => navigate("/channels/@me", { state: { user } })} title="Home" className="server">
                                    <div className={`home-button server-icon ${!server && "isclicked"}`}><HomeIcon /></div>
                                </div>
                                <div className="server-marker" />
                            </div>
                            {notifications.map((n, i) => {
                                const u = new User(n.user)
                                if (notifications.findIndex(not => not.user._id === u.id) !== i) return null
                                const dm = () => navigate(`/channels/@me/${u.id}`, { state: { user: me } })
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
                            <MapServers servers={servers} />
                            <Add user={user} view={setLayer} />
                        </nav>
                        <VoiceChatContext.Provider value={voiceChatContextProvider}>
                            {server ? <Main server={server} /> : <Home />}
                        </VoiceChatContext.Provider>
                    </div>
                    {Object.values(streams).map((stream, i) => <AudioObject key={i} srcObject={stream} />)}
                </div>
                <Masks />
            </AppContext.Provider>
        </UserContext.Provider>
    )
}

export default Message