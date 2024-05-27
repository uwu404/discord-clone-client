import { Link, useParams } from "react-router-dom"
import ChannelIcon from "./channelIcon"
import { useContext } from "react"
import { UserContext } from "../../app/message"

const TextChannel = ({ channel }) => {
    const params = useParams()
    const { user } = useContext(UserContext)
    
    return (
        <Link style={{ textDecoration: "none" }} state={{ user }} to={`/channels/${params.server}/${channel.id}`}>
            <div className={`channel ${params.channel === channel.id ? "c-clicked" : ""}`}>
                <ChannelIcon type="text" size={22} />
                <span>{channel.name}</span>
            </div>
        </Link>
    )
}

export default TextChannel