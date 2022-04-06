import { useContext, useRef, useLayoutEffect, useState, useEffect } from "react"
import User from "."
import { Update } from "../../app"
import { ScreenContext, socket } from "../../app/message"
import Home from "../../app/message/home"
import PreviousQueries from "../../cache"
import Avatar from "../../global/avatar"
import Gear from "../../icons/settings"
import Profile from "./profile"

const UserJSX = ({ user, server, style, setView, editable, onClick }) => {
    const cachedUser = PreviousQueries.userCache.has(user.id) ? new User(PreviousQueries.userCache.get(user.id)) : user
    const { setScreen, setServer, user: me } = useContext(ScreenContext)
    const update = useContext(Update)
    const [top, setTop] = useState(style.top)
    const [seconds, setSeconds] = useState(0)
    const [online, setOnline] = useState(user.online)
    const divRef = useRef()
    useLayoutEffect(() => {
        const viewportOffset = divRef.current.getBoundingClientRect();
        if (style.top > window.innerHeight - viewportOffset.height - 20) setTop(window.innerHeight - viewportOffset.height - 20)
        if (style.top < 10) setTop(10)
        const handleOnlineEvent = (user) => setOnline(user.online)
        socket.on("online", handleOnlineEvent)
        return () => socket.off("online", handleOnlineEvent)
    }, [style.top])

    useEffect(() => {
        const timer = setInterval(() => setSeconds(prev => ++prev), 1000)
        return () => clearInterval(timer)
    }, [])

    const dm = (e) => {
        if (e.code !== "Enter") return
        setServer()
        const fakeEvent = { code: "Enter", target: { textContent: e.target?.value, innerText: e.target?.value } }
        setScreen(<Home update={update} dm={{ user, message: fakeEvent }} user={me} />)
        setView()
    }
    const saveNote = (e) => localStorage.setItem(user.id, e.target.value)

    const viewProfile = () => {
        if (onClick) return onClick()
        setView(<Profile dm={dm} user={user} online={online} />)
    }

    return (
        <div ref={divRef} style={{ ...style, top }} className={`user-div ${!online && "not-online"}`}>
            <div style={{ backgroundColor: cachedUser.profileColor || "#000" }} className="user-bg-1" />
            <div onClick={viewProfile} className="avatar-wrapper">
                <Avatar status={cachedUser.online ? "online" : "offline"} className="bruhbruh" src={cachedUser.displayAvatarURL(90)} size={80} />
                <svg viewBox="0 0 80 80" className="hidden-text" height="80" width="80">
                    <foreignObject overflow="visible" height="80" width="80" y="0" x="0" mask="url(#mask-round-80)">
                        <div className="change-929">{editable ? "CHANGE AVATAR" : "VIEW PROFILE"}</div>
                    </foreignObject>
                </svg>
            </div>
            <h5 className="user-username">{cachedUser.username}<span>{cachedUser.tag}</span></h5>
            <span className="user-custom-status">{cachedUser.online && cachedUser.customStatus}</span>
            <div className="line first" />
            {server &&
                <div className="roles">
                    <h5>ROLES</h5>
                    <div className="role">Member</div>
                    {server.owner === cachedUser.id && <div className="role">Owner</div>}
                    <div className="line last"></div>
                </div>
            }
            {!editable ? <div className="note">
                <h5>NOTE</h5>
                <textarea onChange={saveNote} defaultValue={localStorage.getItem(user.id)} placeholder="Click to add a note"></textarea>
            </div> :
                <div className="customizing-my-profile">
                    <h5>CUSTOMIZING MY PROFILE</h5>
                    <div style={{ height: 70 }} className="flex-line">
                        <div className="activity-icon">
                            <Gear height={50} width={50} />
                        </div>
                        <div className="activity-name">
                            <h5>User Profile</h5>
                            <span>{(~~(seconds / 60)).toFixed().padStart(2, "0")}:{(seconds - (~~(seconds / 60) * 60)).toFixed().padStart(2, "0")} elapsed</span>
                        </div>
                    </div>
                </div>}
            {me._id !== user.id && <input onKeyDown={dm} placeholder={`Message ${cachedUser.username}${cachedUser.tag}`} className="dm-user" />}
        </div>
    )
}

export default UserJSX