import { useCache } from "../../../cache"
import User from "../../../classes/user"
import AboutMe from "../../../classes/user/miniProfile/aboutMe"
import MemberSince from "../../../classes/user/miniProfile/membesince"
import Note from "../../../classes/user/miniProfile/note"
import Avatar from "../../../global/avatar"
import "./userProfile.css"

const UserProfile = ({ user }) => {
    const getCache = useCache(user.id)
    const cachedUser = getCache ? new User(getCache) : user

    return (
        <div className="user-profile-2">
            <div style={{ backgroundColor: cachedUser.profileColor || "#000" }} className="user-bg mini-user-bg"></div>
            <div className="dm-profile">
                <div className="avatar-wrapper bordered dm-profile-avatar">
                    <Avatar size={80} src={cachedUser.displayAvatarURL(90)} status={cachedUser.status || "offline"} />
                </div>
                <div className="profile-body mini-profile-body">
                    <div className="user-username">
                        <div className="user-username-notag">{cachedUser.username}</div>
                        <span>{cachedUser.tag}</span>
                    </div>
                    <div className="line first"></div>
                    <div className="mini-profile-content">
                        <AboutMe content={cachedUser.about} />
                        <MemberSince user={user} display />
                        <div className="line first"></div>
                        <Note display user={cachedUser} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile