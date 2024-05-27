import { useContext } from "react"
import { VoiceChatContext } from "../../../app/message"
import HangUp from "../../../assets/hangUp"

const Connection = () => {
    const {connection, setConnection } = useContext(VoiceChatContext)
    const leaveVC = () => setConnection()

    if (!connection) return null
    return (
        <div className="connection">
            <div className="connection-name">
                <div>
                    <h3>Voice Connected</h3>
                    <span>{connection.name}/{connection.server?.name}</span>
                </div>
                <div onClick={leaveVC} className="settings-button leave-vc"><HangUp size={20} /></div>
            </div>
        </div>
    )
}

export default Connection