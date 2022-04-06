import Server from "../server"
import { useState } from "react"
import { link } from "../../config.json"

const Invite = ({ invite, code, onJoin, me }) => {
    const server = new Server(invite)
    const text = me.servers.find(s => s._id === server.id) ? "Joined" : "Join"
    const [state, setState] = useState(text)

    const join = () => {
        if (text === "Joined" || state === "...") return
        setState("...")
        fetch(`${link}servers/${code}`, { method: "POST", headers: { Authorization: me.token } })
            .then((res) => res.json())
            .then((server) => {
                setState("Joined")
                onJoin(server)
            })
    }

    return (
        <div className="message-invite">
            <img width="40" height="40" className="server-invite-icon" src={server.displayIcon(57)} alt="icon" />
            <div className="name-and-members">
                <h4 className="server-invite-name">{server.name}</h4>
                <div className="member-count">{invite.members.length} member{invite.members.length !== 1 && "s"}</div>
            </div>
            <button onClick={join} className="server-invite-join">{state}</button>
        </div>
    )
}

export default Invite