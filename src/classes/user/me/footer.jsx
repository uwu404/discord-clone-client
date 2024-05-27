import { useContext, useRef, useState } from "react"
import { AppContext, UserContext, VoiceChatContext } from "../../../app/message"
import Gear from "../../../assets/settings"
import Avatar from "../../../global/avatar"
import MicSlash from "../../../assets/mic-slash"
import Connection from "./connection"
import "./footer.css"
import MyProfile from "./myProfile"

const Footer = () => {
    const { user } = useContext(UserContext)
    const { setLayer, setShowSettings } = useContext(AppContext)
    const { connectionOptions, setConnectionOptions } = useContext(VoiceChatContext)
    const container = useRef()
    const [clicked, setClicked] = useState(false)

    const showSettings = () => setShowSettings("user-settings")

    const clickOut = (...args) => {
        setClicked(false)
        setLayer(...args)
    }

    const showStatus = () => {
        if (clicked) return clickOut()
        setClicked(true)
        setLayer(<MyProfile container={container} clickOut={clickOut} />)
    }

    return (
        <>
            <Connection />
            <footer ref={container} className="footer">
                <div className="flex-m13" onClick={showStatus}>
                    <div className="icon-div">
                        <Avatar className="my-pfp" status={user.status} src={user.displayAvatarURL(90)} size={32} />
                    </div>
                    <h5 className="my-username">{user.username}<span>{user.tag}</span></h5>
                </div>
                <div onClick={() => setConnectionOptions(prev => ({ ...prev, audio: !prev.audio }))} className="settings-button" title="Mic Off">
                    <MicSlash muted={!connectionOptions.audio} size={18} />
                </div>
                <div title="User Settings" onClick={showSettings} className="settings-button user-settings-button">
                    <Gear width={17} height={17} />
                </div>
            </footer>
        </>
    )
}

export default Footer