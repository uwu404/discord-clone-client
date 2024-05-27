import { useContext } from "react"
import { UserContext } from "../../../app/message"
import PreviousQueries from "../../../cache"
import User from "../../user"
import MemberJSX from "./member"

const MapMembers = ({ members, server }) => {
    const { user } = useContext(UserContext)
    const onlineLength = members.filter(m => m.status !== "offline").length
    const offlineLength = members.length - onlineLength
    const online = [<h5 className="members-title" key="online">ONLINE — {onlineLength}</h5>],
        offline = [<h5 className="members-title" key="offline">OFFLINE — {offlineLength}</h5>]
    const sortedMembers = members.sort((a, b) => a.username.localeCompare(b.username))
    for (const member of sortedMembers) {
        const Member = new User(PreviousQueries.userCache.get(member._id) || member)
        const jsx = <MemberJSX member={Member} key={Member.id} server={server} me={user} />
        if (member.status !== "offline") online.push(jsx)
        else offline.push(jsx)
    }
    if (offline.length === 1) offline.length = 0
    if (online.length === 1) online.length = 0
    return online.concat(offline)
}

export default MapMembers