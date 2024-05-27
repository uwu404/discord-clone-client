import { Fragment, useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AppContext, UserContext } from ".."
import Channel from "../../../classes/channel"
import Server from "../../../classes/server"
import User from "../../../classes/user"
import Hashtag from "../../../assets/hashtag"
import Animate from "../../../global/animate"
import "./findConversation.css"

const MapLogs = ({ logs }) => {
    const navigate = useNavigate()
    const { user } = useContext(UserContext)

    return logs.map(l => {
        const log = new User(l)

        return (
            <li key={log.id} onClick={() => navigate(`/channels/@me/${log.id}`, { state: { user } })} className="search-result">
                <img alt={log.username} src={log.displayAvatarURL(90)} className="icon-avatar" style={{ width: 20, height: 20, borderRadius: "50%" }} />
                <span>{log.username}</span>
                <span className="searching-users">{log.username + log.tag}</span>
            </li>
        )
    })
}

const MapChannels = ({ server, filter }) => {
    const navigate = useNavigate()
    const { user } = useContext(UserContext)

    return server.channels.map(c => {
        if (!c.name.toLowerCase().includes(filter.toLowerCase())) return null
        if (c.type === "voice") return null
        const channel = new Channel(c)
        const clickEvent = () => navigate(`/channels/${server.id}/${channel.id}`, { state: { user } })
        return (
            <li onClick={clickEvent} key={channel.id} className="search-result">
                <Hashtag size={20} />
                <span>{channel.name}</span>
                <span className="searching-channels">{c.type.toUpperCase()} CHANNELS</span>
                <div className="channelserver"><span>{server.name}</span></div>
            </li>
        )
    })
}

const MapServers = ({ filter }) => {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()

    return user.servers.map(s => {
        const server = new Server(s, user)
        const isSearched = server.name.toLowerCase().includes(filter.toLowerCase())
        if (!isSearched && !server.channels.some(c => c.name.toLowerCase().includes(filter.toLowerCase()))) return null

        return (
            <Fragment key={server.id} >
                <MapChannels filter={filter} server={server} />
                {isSearched && <li onClick={() => navigate(`/channels/${server.id}/${server.channels[0]._id}`, { state: { user } })} className="search-result">
                    <img alt={server.name} src={server.displayIcon(100)} className="icon-avatar" style={{ width: 20, height: 20, borderRadius: 5 }} />
                    <span>{server.name}</span>
                </li>}
            </Fragment>
        )
    })
}

const FindConversation = ({ logs, clickUser }) => {
    const [filter, setFilter] = useState("")
    const { setLayer } = useContext(AppContext)

    const clickEv = (user) => {
        setLayer()
        clickUser(user)
    }

    return (
        <Animate>
            <div className={`generic-popup find-conversation animated-popup`}>
                <input placeholder="Where would you like to go?" onChange={e => setFilter(e.target.value)} className="big-input" />
                <div className="list stylish-scrollbar">
                    <ul>
                        <MapLogs click={clickEv} logs={logs.filter(log => log.username.toLowerCase().includes(filter.toLowerCase()))} />
                        <MapServers click={() => setLayer()} filter={filter} />
                    </ul>
                </div>
                <div className="protips">
                    <span className="protip"><span className="highlight-green">PROTIP:</span> Start Searches with to narrow results.</span>
                </div>
            </div>
        </Animate>
    )
}

export default FindConversation