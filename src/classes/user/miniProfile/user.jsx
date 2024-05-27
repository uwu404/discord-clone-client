import { useContext, useRef, useLayoutEffect, useState, forwardRef } from "react"
import { useNavigate } from "react-router-dom"
import User from ".."
import { UserContext } from "../../../app/message"
import { useCache } from "../../../cache"
import Avatar from "../../../global/avatar"
import Note from "./note"
import Profile from "../profile/profile"
import Roles from "./roles"
import Timer from "./timer"
import AboutMe from "./aboutMe"
import MemberSince from "./membesince"
import "./user.css"

const UserJSX = ({ user, server, style, setLayer, editable, onClick, children, empty }, ref) => {
    const getCache = useCache(user.id)
    const cachedUser = getCache ? new User(getCache) : user
    const { user: me, socket } = useContext(UserContext)
    const navigate = useNavigate()
    const [top, setTop] = useState(style.top)
    const [status, setStatus] = useState(cachedUser.status)
    const divRef = useRef()

    useLayoutEffect(() => {
        const viewportOffset = divRef.current.getBoundingClientRect();
        if (style.top > window.innerHeight - viewportOffset.height - 20) setTop(window.innerHeight - viewportOffset.height - 20)
        if (style.top < 10) setTop(10)
        const handleOnlineEvent = (user) => setStatus(user.status)
        socket.on("statusChange", handleOnlineEvent)
        return () => socket.off("statusChange", handleOnlineEvent)
    }, [style.top, socket])

    const dm = (e) => {
        if (e.code !== "Enter") return
        const fakeEvent = { code: "Enter", target: { textContent: e.target?.value, innerText: e.target?.value } }
        navigate(`/channels/@me/${user.id}`, { state: { user: me, dm: { message: fakeEvent, user } } })
        setLayer()
    }

    const viewProfile = () => {
        if (onClick) return onClick()
        setLayer(<Profile dm={dm} user={user} />)
    }

    const assignRefs = el => {
        divRef.current = el
        ref?.(el)
    }

    return (
        <div ref={assignRefs} style={{ ...style, top }} className={`user-div lowkey ${status === "offline" && "not-online"}`}>
            <div style={{ backgroundColor: (editable ? user.profileColor : cachedUser.profileColor) || "#000" }} className="user-bg-1" />
            <div onClick={viewProfile} className="avatar-wrapper bordered">
                <Avatar status={cachedUser.status} className="bruhbruh" src={editable ? user.displayAvatarURL() : cachedUser.displayAvatarURL(90)} size={80} />
                <svg viewBox="0 0 80 80" className="hidden-text" height="80" width="80">
                    <foreignObject overflow="visible" height="80" width="80" y="0" x="0" mask="url(#mask-round-80)">
                        <div className="change-929">{editable ? "CHANGE AVATAR" : "VIEW PROFILE"}</div>
                    </foreignObject>
                </svg>
            </div>
            <div className="profile-body mini-profile-body">
                <div className="user-username"><div className="user-username-notag">{cachedUser.username}</div><span>{cachedUser.tag}</span></div>
                <span className="user-custom-status">{cachedUser.online && cachedUser.customStatus}</span>
                <div className="line first" />
                <div className="mini-profile-content">
                    <AboutMe content={!empty && (editable ? user.about : cachedUser.about)} />
                    <MemberSince display={!editable} user={user} />
                    <Roles user={cachedUser} server={server} />
                    <Note display={!editable && !empty} user={user} />
                    <Timer display={editable} />
                    {children}
                    {me._id !== user.id && <input onKeyDown={dm} placeholder={`Message ${cachedUser.username}${cachedUser.tag}`} className="dm-user" />}
                </div>
            </div>
        </div>
    )
}

export default forwardRef(UserJSX)