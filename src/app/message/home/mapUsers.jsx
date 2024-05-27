import { useNavigate } from "react-router-dom"
import User from "../../../classes/user"
import Plus from "../../../assets/plus"
import { useContext } from "react"
import { UserContext } from ".."
import Avatar from "../../../global/avatar"

const MapUsers = ({ users, type, onClick }) => {
    const navigate = useNavigate()
    const { user: me } = useContext(UserContext)

    return users.map(u => {
        if (!u) return null
        const user = new User(u)
        const click = () => {
            if (type !== "requests") navigate(`/channels/@me/${user.id}`, { state: { user: me, dm: { user } } })
            else onClick(user)
        }
        return (
            <div key={user.id} className="friend">
                <div className="balencer">
                    <Avatar status={user.status} src={user.displayAvatarURL("90")} size={32} />
                </div>
                <div>
                    <h5 className="friend-name">{user.username}<span>{user.tag}</span></h5>
                    <p className="state">{type === "requests" && u.received && "Incoming friend request"}</p>
                    <p className="state">{type === "requests" && !u.received && "Ongoing friend request"}</p>
                    <p className="state">{type === "friends" && (!u.online ? "Offline" : "Online")}</p>
                </div>
                {type === "requests" && u.received && <div onClick={click} className="accept"><Plus size={15} /></div>}
                {type === "friends" && <div onClick={click} className="accept">DM</div>}
            </div>
        )
    })
}

export default MapUsers