import { Link, useParams } from "react-router-dom"
import User from "../../../classes/user"
import { useCache } from "../../../cache"
import Avatar from "../../../global/avatar"

const DmUser = ({ user }) => {
    const { channel } = useParams()
    const getCache = useCache(user.id)
    const cachedUser = new User(getCache || user)

    return (
        <Link style={{ textDecoration: "none" }} key={cachedUser.id} state={{ user: user }} to={`/channels/@me/${cachedUser.id}`}>
            <div style={{ opacity: 1 }} className={`member log ${channel === cachedUser.id && "member-clicked"} ${!cachedUser.status === "offline" && "member-offline"}`}>
                <div className="member-avatar">
                    <Avatar size={32} status={cachedUser.status} src={cachedUser.displayAvatarURL(90)} />
                </div>
                <div className="nice-div">
                    <h4 className={`member-name`}>{cachedUser.username}</h4>
                    <p className="is-online">{cachedUser.online && cachedUser.customStatus}</p>
                </div>
            </div>
        </Link>
    )
}

export default DmUser