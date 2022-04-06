import { useContext, useState } from "react"
import Animate from "../../app/animate"
import { ScreenContext } from "../../app/message"
import Avatar from "../../global/avatar"
import Server from "../server"
import "./profile.css"

const MapServers = ({ servers }) => {
    return (
        <div className="list" style={{ marginTop: 10, height: "100%" }}>
            {servers.map(server => {
                const s = new Server(server)
                return (
                    <div key={s.id} className="mutual-server friend">
                        {server.icon ? <img width="40" height="40" alt="uwu" src={s.displayIcon(100)} className="friend-pfp server-ico" /> :
                            <div style={{ width: 40, height: 40, background: "var(--blue)" }} className="default-no-img-div server-ico friend-pfp">{server.name[0]}</div>}
                        <h5 className="friend-name">{s.name}</h5>
                    </div>
                )
            })}
        </div>
    )
}

const UserInfo = ({ user }) => {
    const saveNote = (e) => localStorage.setItem(user.id, e.target.value)

    return (
        <div style={{ padding: "0 15px", boxSizing: "border-box" }} className="note">
            <h5>NOTE</h5>
            <textarea defaultValue={localStorage.getItem(user.id)} onChange={saveNote} placeholder="Click to add note"></textarea>
        </div>
    )
}

const All = ({ button, servers, user }) => {
    switch (button) {
        case 1: return <UserInfo user={user} />
        case 2: return <MapServers servers={servers} />
        case 3: return <div style={{ marginTop: 10 }} className="list"></div>
        default: return null
    }
}

const Profile = ({ user, dm, online }) => {
    const [button, setButton] = useState(1)
    const { user: me } = useContext(ScreenContext)
    const mutualServers = me.servers.filter(s => s.members.includes(user.id))

    const update = (button) => () => setButton(button)

    const backgroundImage = !user.profileColor && `url(${user.displayAvatarURL(90)})`
    return (
        <Animate>
            <div className={`view-profile animated-popup ${!online && "not-online"}`}>
                <div style={{ backgroundColor: user.profileColor || "#000000", backgroundImage }} className="user-bg"></div>
                <div className="pfp-wrapper">
                    <Avatar src={user.displayAvatarURL(120)} status={user.online ? "online" : "offline"} size={120} className="bruhbruh"/>
                </div>
                {me._id !== user.id && <button onClick={() => dm({ code: "Enter" })} className="send-req">Send Message</button>}
                {/*i ran out of classnames*/}
                <h3 className="uwu-20">{user.username}<span>{user.tag}</span></h3>
                <div className="more-with-border">
                    <div className="more">
                        <div onClick={update(1)} className={`more-div user-info-2 ${button === 1 && "clicked"}`}>User Info</div>
                        <div onClick={update(2)} className={`more-div mutual-servers ${button === 2 && "clicked"}`}>Mutual Servers</div>
                        <div onClick={update(3)} className={`more-div mutual-friends ${button === 3 && "clicked"}`}>Mutual Friends</div>
                    </div>
                </div>
                <div className="even-more">
                    <All button={button} servers={mutualServers} user={user} />
                </div>
            </div>
        </Animate>
    )
}

export default Profile