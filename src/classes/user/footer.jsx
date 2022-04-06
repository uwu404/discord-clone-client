import { useContext } from "react"
import User from "."
import { ScreenContext } from "../../app/message"
import Gear from "../../icons/settings"
import StatusManager from "../../app/message/statusManager"
import Avatar from "../../global/avatar"

const Footer = () => {
    const { user, setView, setShowSettings } = useContext(ScreenContext)
    const me = new User(user)

    const showSettings = () => setShowSettings(true)

    return (
        <footer className="footer">
            <div className="icon-div">
                <Avatar onClick={() => setView(<StatusManager />)} className="my-pfp" status={"online"} src={me.displayAvatarURL(90)} size={32} />
            </div>
            <h5 className="my-username">{me.username}<span>{me.tag}</span></h5>
            <div title="User Settings" onClick={showSettings} className="settings-button"><Gear width={17} height={17} /></div>
        </footer>
    )
}

export default Footer