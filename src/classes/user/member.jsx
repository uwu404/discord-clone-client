import { useContext, useState } from "react"
import User from "."
import { ScreenContext } from "../../app/message"
import PreviousQueries from "../../cache"
import Avatar from "../../global/avatar"
import Crown from "../../icons/crown"
import Utils from "../../utils"
import UserJSX from "./user"

const MemberJSX = ({ server, member }) => {
    const user = PreviousQueries.userCache.has(member.id) ? new User(PreviousQueries.userCache.get(member.id)) : member
    const [isClicked, setIsClicked] = useState(false)
    const { setView } = useContext(ScreenContext)
    const showUser = (e) => {
        setIsClicked(true)
        const cancel = () => {
            setIsClicked(false)
            setView()
        }
        const top = e.target.getBoundingClientRect().top - 40
        const clickOut = (...args) => {
            setIsClicked(false)
            setView(...args)
        }
        setView(
            <Utils.Out click={cancel}>
                <UserJSX user={member} setView={clickOut} style={{ right: 245, top, animationName: "reverseShift" }} server={server}/>
            </Utils.Out>
        )
    }
    return (
        <div onClick={showUser} key={member.id} className={`member ${isClicked && "member-clicked"} ${!user.online && "member-offline"}`}>
            <div className="member-avatar">
                <Avatar className="bruhbruh" status={user.online ? "online" : "offline"} size={32} src={user.displayAvatarURL(90)}/>
            </div>
            <div className="nice-div">
                <span className={`member-name ${server?.owner === member.id && "owner"}`}>{user.username} {server?.owner === member.id && <Crown size={16} />}</span>
                <span className="is-online">{user.online ? user.customStatus : null}</span>
            </div>
        </div>
    )
}

export default MemberJSX