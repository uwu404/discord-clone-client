import { useEffect, useState, createContext } from "react"
import Server from "../../classes/server"
import "./index.css"
import Main from "./message"
import { link } from "../../config.json"
import { io } from "socket.io-client"
import Home from "./home"
import HomeIcon from "../../icons/home"
import { usersCache } from "../../classes/user"
import { messages } from "../../classes/channel"

export const ThemeContext = createContext()
export const ScreenContext = createContext()
export const socket = io(link, { transports: ['websocket', 'polling', 'flashsocket'] })

const Message = ({ user: me, update, dm }) => {
    const [user, setUser] = useState(me)
    const [server, setServer] = useState()

    useEffect(() => {
        socket.connect()
        socket.emit("online", me.token)
        socket.on("memberUpdate", newUser => {
            const user = usersCache[`${newUser._id}`]
            user.avatarURL = newUser.avatarURL
            user.username = newUser.username
        })
        return () => {
            socket.disconnect()
            messages.clear()
            for (const key in usersCache) {
                delete usersCache[key]
            }
        }
    }, [me])

    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light")
    const [screen, setScreen] = useState(<Home user={user} update={update} />)
    const click = (s) => {
        if (server?.id === s.id) return
        setServer(s)
    }
    const [servers, setServers] = useState(user.servers)
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
    }, [server, update, user, dm])

    const homeClick = () => server && setServer()

    const index = () => {
        const iserver = user.servers.find(s => s._id === server?.id)
        return user.servers.indexOf(iserver)
    }

    return (
        <ThemeContext.Provider value={setTheme}>
            <ScreenContext.Provider value={{ setScreen, setServer, setUser }}>
                <div theme={theme} className="platform">
                    {view}
                    <div className="navigate">
                        <div style={{ marginTop: 10, marginBottom: 3 }} className={`server ${!server && "click"}`}>
                            <div onClick={homeClick} className={`home-button ${!server && "isclicked"}`}><HomeIcon /></div>
                        </div>
                        <div className="border-bottom" />
                        {<Server.LoadServers index={index()} me={user} servers={servers} click={click} isHome={!server} />}
                        {<Server.Add user={user} onCreate={create} view={setView} />}
                    </div>
                    {screen}
                </div>
            </ScreenContext.Provider>
        </ThemeContext.Provider>
    )
}

export default Message