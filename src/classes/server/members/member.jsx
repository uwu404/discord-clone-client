import { useContext, useState } from "react"
import { AppContext } from "../../../app/message"
import Avatar from "../../../global/avatar"
import Crown from "../../../assets/crown"
import UserJSX from "../../user/miniProfile/user"
import OutSideListener from "../../../global/outSideListener"

const MemberJSX = ({ server, member }) => {
    const [isClicked, setIsClicked] = useState(false)
    const { setLayer } = useContext(AppContext)
    const showUser = (e) => {
        setIsClicked(true)
        const cancel = () => {
            setIsClicked(false)
            setLayer()
        }
        const top = e.target.getBoundingClientRect().top - 40
        const clickOut = (...args) => {
            setIsClicked(false)
            setLayer(...args)
        }
        setLayer(
            <OutSideListener onClick={cancel}>
                <UserJSX user={member} setLayer={clickOut} style={{ right: 245, top, animationName: "reverseShift" }} server={server}/>
            </OutSideListener>
        )
    }
    return (
        <div onClick={showUser} key={member.id} className={`member ${isClicked && "member-clicked"} ${member.status === "offline" && "member-offline"}`}>
            <div className="member-avatar">
                <Avatar className="bruhbruh" status={member.status || "offline"} size={32} src={member.displayAvatarURL(90)}/>
            </div>
            <div className="nice-div">
                <span className={`member-name ${server?.owner === member.id && "owner"}`}>{member.username} {server?.owner === member.id && <Crown size={16} />}</span>
                <span className="is-online">{member.status !== "offline" && member.customStatus}</span>
            </div>
        </div>
    )
}

export default MemberJSX