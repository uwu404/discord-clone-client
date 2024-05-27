import { useContext } from "react"
import { AppContext, UserContext } from "../../../app/message"
import Avatar from "../../../global/avatar"
import EditUsername from "./editUserName"


const MyAccount = ({ setButton, onChange, changes }) => {
    const { user } = useContext(UserContext)
    const { setLayer } = useContext(AppContext)
    const click = () => setLayer(<EditUsername onChange={onChange} user={user} />)

    return (
        <div className="my-account">
            <h2 className="my-account-header">My Account</h2>
            <div className="my-settings">
                <div style={{ backgroundColor: user.profileColor || "#000" }} className="profile-color"></div>
                <div className="section-17">
                    <div className="section-721">
                        <div className="my-avatar-wrapper">
                            <Avatar status={user.status} size={80} src={user.displayAvatarURL(90)} />
                        </div>
                        <h5 className="username-382">{changes.username || user.username}<span>{user.tag}</span></h5>
                        <button onClick={setButton(1)} style={{ marginLeft: "auto" }} className="generic-button primary button-121">Edit User Profile</button>
                    </div>
                    <div className="section-832">
                        <div className="username-77 flex-line">
                            <div>
                                <h5 className="field-title">USERNAME</h5>
                                <div className="div-410"><span>{changes.username || user.username}</span><span className="text-info">{user.tag}</span></div>
                            </div>
                            <button onClick={click} style={{ color: "var(--font-primary)", marginLeft: "auto" }} className="generic-button secondary">Edit</button>
                        </div>
                        <div className="email-10 flex-line">
                            <div>
                                <h5 className="field-title">EMAIL</h5>
                                <div className="div-410">{user.email}</div>
                            </div>
                        </div>
                        <div className="phone-number-47 flex-line">
                            <div>
                                <h5 className="field-title">PHONE NUMBER</h5>
                                <div className="text-info">This app doesn't support phone numbers</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyAccount