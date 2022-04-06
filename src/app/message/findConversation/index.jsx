import { Fragment, useContext, useState } from "react"
import { ScreenContext } from "../"
import Channel from "../../../classes/channel"
import Server from "../../../classes/server"
import User from "../../../classes/user"
import Hashtag from "../../../icons/hashtag"
import Animate from "../../animate"
import "./index.css"

const MapLogs = ({ logs, click }) => {
    return logs.map(l => {
        const log = new User(l)

        return (
            <li key={log.id} onClick={() => click(log)} className="search-result">
                <img alt={log.username} src={log.displayAvatarURL(90)} className="icon-avatar" style={{ width: 20, height: 20, borderRadius: "50%" }} />
                <span>{log.username}</span>
            </li>
        )
    })
}

const MapChannels = ({ server }) => {
    return server.channels.map(c => {
        const channel = new Channel(c)
        return (
            <li key={channel.id} className="search-result">
                <Hashtag size={20} />
                <span>{channel.name}</span>
            </li>
        )
    })
}

const MapServers = ({ filter, click }) => {
    const { user, setServer } = useContext(ScreenContext)
    return user.servers.map(s => {
        const server = new Server(s, user)
        if (!server.name.includes(filter)) return null
        const c = () => {
            click()
            setServer(server)
        }
        return (
            <Fragment key={server.id} >
                <MapChannels server={server} />
                <li onClick={c} className="search-result">
                    <img alt={server.name} src={server.displayIcon(100)} className="icon-avatar" style={{ width: 20, height: 20, borderRadius: 5 }} />
                    <span>{server.name}</span>
                </li>
            </Fragment>
        )
    })
}

const FindConversation = ({ logs, clickUser }) => {
    const [filter, setFilter] = useState("")
    const { setView } = useContext(ScreenContext)

    const clickEv = (user) => {
        setView()
        clickUser(user)
    }

    return (
        <Animate>
            <div className={`generic-popup find-conversation animated-popup`}>
                <input placeholder="Where would you like to go?" onChange={e => setFilter(e.target.value)} className="big-input" />
                <div className="list">
                    <ul>
                        <MapLogs click={clickEv} logs={logs.filter(log => log.username.includes(filter))} />
                        <MapServers click={() => setView()} filter={filter} />
                    </ul>
                </div>
            </div>
        </Animate>
    )
}

export default FindConversation