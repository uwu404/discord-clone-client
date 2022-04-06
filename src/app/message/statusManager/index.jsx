import { useContext } from "react"
import { ScreenContext } from ".."
import User from "../../../classes/user"
import Animate from "../../animate"
import "./index.css"
import CustomStatus from "./setCustomStatus"

const StatusManager = () => {
    const { user, setView } = useContext(ScreenContext)
    const me = new User(user)

    const setCustomStatus = () => setView(<CustomStatus />)

    return (
        <Animate normal type={1}>
            <div style={{ width: 220, left: 84, bottom: 62, transformOrigin: "bottom center" }} className="status-manager generic-menu animated-popup">
                <div onClick={setCustomStatus} className="current-status option">{me.customStatus ? me.customStatus : "Set a custom status"}</div>
            </div>
        </Animate>
    )
}

export default StatusManager