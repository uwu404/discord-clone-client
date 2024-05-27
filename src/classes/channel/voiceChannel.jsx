import { useContext, useRef, useState } from "react"
import { AppContext, UserContext, VoiceChatContext } from "../../app/message"
import User from "../user"
import UserJSX from "../user/miniProfile/user"
import ChannelIcon from "./channelIcon"
import "./voiceChannel.css"
import OutSideListener from "../../global/outSideListener"

const ConnectedUser = ({ user: u, channel }) => {
    const user = new User(u)
    const divRef = useRef()
    const [isClicked, setIsClicked] = useState(false)
    const { setLayer } = useContext(AppContext)

    const clickOut = (...args) => {
        setIsClicked(false)
        setLayer(...args)
    }
    const clickEv = () => {
        if (isClicked) {
            setLayer()
            return setIsClicked(false)
        }
        setIsClicked(true)
        const viewportOffset = divRef.current.getBoundingClientRect()
        const style = {
            left: viewportOffset.left + viewportOffset.width + 7 < window.innerWidth - 275 ? viewportOffset.left + viewportOffset.width + 7 : window.innerWidth - 275,
            top: viewportOffset.top - 60
        }
        setLayer(<OutSideListener getEvent onClick={e => !divRef.current?.contains(e.target) && clickOut()}><UserJSX setLayer={clickOut} editable={false} style={style} server={channel.server} user={user} /></OutSideListener>)
    }

    return (
        <li>
            <div ref={divRef} onClick={clickEv} className={`connected-user ${isClicked && "clicked"}`}>
                <div className="wrapperx-51">
                    <img className="connected-user-pfp" height={20} width={20} alt="user-pfp" src={user.displayAvatarURL(90)} />
                </div>
                <div className="connected-user-username">
                    <span>{user.username}</span>
                </div>
            </div>
        </li>
    )
}

const VoiceChannel = ({ channel }) => {
    const { user } = useContext(UserContext)
    const { connections, connection, setConnection } = useContext(VoiceChatContext)
    const isConnected = connection?.id === channel.id

    const joinVC = () => {
        if (isConnected) return
        setConnection(channel)
    }

    return (
        <div>
            <div onClick={joinVC} className={`channel voice-channel ${isConnected && "clicked"}`}>
                <ChannelIcon type="voice" size={22} />
                <span>{channel.name}</span>
            </div>
            <ul>
                {(connections.find(c => c._id === channel.id)?.users || []).map(u => {
                    if ((user._id === u._id) && isConnected) return null
                    return <ConnectedUser key={u._id} channel={channel} user={u} />
                })}
                {isConnected && <ConnectedUser user={user} channel={channel} />}
            </ul>
        </div>
    )
}

export default VoiceChannel