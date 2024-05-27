import { useContext, useRef, useState } from "react"
import { link } from "../../../config.json"
import Down from "../../../assets/down"
import CreateChannel from "../../channel/createChannel"
import InvitePeople from "../invite-people"
import { AppContext, UserContext } from "../../../app/message"
import OutSideListener from "../../../global/outSideListener"
import "./menu.css"
import Plus from "../../../assets/plus"

const ServerMenu = ({ server }) => {
    const { user } = useContext(UserContext)
    const { setLayer, setShowSettings } = useContext(AppContext)
    const [clicked, setClicked] = useState(false)
    const container = useRef()

    const clickOut = (...args) => {
        setClicked(false)
        setLayer(...args)
    }

    const invite = () => clickOut(<InvitePeople server={server} />)

    const leave = () => {
        fetch(`${link}leave/${server.id}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        })
    }

    const createNewChannel = () => clickOut(<CreateChannel server={server} animation="bigger" />)

    const showServerSettings = () => {
        clickOut()
        setShowSettings("server-settings")
    }

    const clickMenu = (ev) => {
        if (clicked) return clickOut()
        setClicked(true)
        setLayer(
            <OutSideListener onClick={(e) => !container.current.contains(e.target) && clickOut()}>
                <div className={`server-menu`}>
                    {server.owner === user._id && <>
                        <p onClick={showServerSettings}>Server Settings</p>
                        <p onClick={createNewChannel}>Create Channel</p></>}
                    <p onClick={invite} className="invite-people">Invite People</p>
                    {server.owner !== user._id && <><div className="separator"></div>
                        <p onClick={leave} className="leave-server">Leave Server</p></>}
                </div>
            </OutSideListener>
        )
    }

    return (
        <header ref={container} onClick={clickMenu} className={`server-name`}>
            <div className={`server-name-3 ${clicked && "server-name-2"}`}>
                <span>{server.name}</span>
                {clicked ? <Plus size={22} /> : <Down size="23" />}
            </div>
        </header>
    )
}

export default ServerMenu