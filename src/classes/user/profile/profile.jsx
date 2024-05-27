import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import Animate from "../../../global/animate"
import { UserContext } from "../../../app/message"
import Avatar from "../../../global/avatar"
import Server from "../../server"
import "./profile.css"
import MemberSince from "../miniProfile/membesince"
import AboutMe from "../miniProfile/aboutMe"
import Note from "../miniProfile/note"
import { useCache } from "../../../cache"
import User from ".."

const MapServers = ({ servers }) => {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()

    const mappedServers = servers.reverse().map(server => {
        const s = new Server(server)
        const navigateToServer = () => navigate(`/channels/${s.id}`, { state: { user } })

        return (
            <div onClick={navigateToServer} key={s.id} className="mutual-server friend">
                {server.icon ? <img width="40" height="40" alt="server icon here" src={s.displayIcon(100)} className="friend-pfp server-ico" /> :
                    <div style={{ width: 40, height: 40, background: "var(--blue)" }} className="default-no-img-div server-ico friend-pfp">{server.name[0]}</div>}
                <h5 className="friend-name">{s.name}</h5>
            </div>
        )
    })

    return (
        <div className="profile-server-list">
            {mappedServers}
        </div>
    )
}

const UserInfo = ({ user }) => {

    return (
        <div className="flex-bn">
            <AboutMe content={user.about} />
            <MemberSince display user={user} />
            <Note display user={user} />
        </div>
    )
}

const Render = ({ elementId, servers, user }) => {
    switch (elementId) {
        case 1: return <UserInfo user={user} />
        case 2: return <MapServers servers={servers} />
        case 3: return <div></div>
        default: return null
    }
}

const Profile = ({ user }) => {
    const getCache = useCache(user.id)
    const cachedUser = getCache ? new User(getCache) : user
    const [button, setButton] = useState(1)
    const { user: me } = useContext(UserContext)
    const mutualServers = me.servers.filter(s => s.members.includes(user.id))
    const navigate = useNavigate()

    const update = (button) => () => setButton(button)
    const dm = () => navigate(`/channels/@me/${user.id}`, { state: { user: me, dm: { user } } })

    return (
        <Animate>
            <div className={`view-profile animated-popup ${cachedUser.status === "offline" && "not-online"}`}>
                <div style={{ backgroundColor: cachedUser.profileColor || "#000" }} className="user-bg"></div>
                <div className="profile-wrapper lowkey">
                    <div className="flex-zone">
                        <div className="pfp-wrapper bordered">
                            <Avatar src={cachedUser.displayAvatarURL(120)} status={cachedUser.status} size={120} className="bruhbruh" />
                        </div>
                        {me._id !== user.id && <button onClick={dm} className="send-req">Send Message</button>}
                    </div>
                    <div className="profile">
                        <div className="profile-body">
                            <h3 className="uwu-20">{cachedUser.username}<span>{cachedUser.tag}</span></h3>
                            <div className="more-with-border">
                                <div className="more">
                                    <div onClick={update(1)} className={`more-div user-info-2 ${button === 1 && "clicked"}`}>User Info</div>
                                    <div onClick={update(2)} className={`more-div mutual-servers ${button === 2 && "clicked"}`}>Mutual Servers</div>
                                    <div onClick={update(3)} className={`more-div mutual-friends ${button === 3 && "clicked"}`}>Mutual Friends</div>
                                </div>
                            </div>
                            <div className="even-more">
                                <Render elementId={button} servers={mutualServers} user={cachedUser} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Animate>
    )
}

export default Profile