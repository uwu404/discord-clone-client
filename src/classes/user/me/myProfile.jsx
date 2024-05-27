import { useContext, useState } from "react"
import Down from "../../../assets/down"
import { UserContext } from "../../../app/message"
import ConfirmLogout from "../settings/confirmLogout"
import OutSideListener from "../../../global/outSideListener"
import StatusList from "./statusList"
import UserJSX from "../miniProfile/user"
import CustomStatus from "./customStatus"

const MyProfile = ({ clickOut, container }) => {
    const { user } = useContext(UserContext)
    const [showStatusList, setShowStatusList] = useState(false)

    const handleMouseEnter = () => {
        setShowStatusList(true)
    }

    const handleMouseLeave = () => {
        setShowStatusList(false)
    }

    return (
        <OutSideListener onClick={e => !container.current.contains(e.target) && clickOut()}>
            <UserJSX empty setLayer={clickOut} style={{ bottom: 60, left: 60, animation: "none" }} user={user}>
                <div className="my-opinion">
                    <div onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter} className={`your-opinion ${showStatusList ? "is-hovered" : ""}`}>
                        <span>Online</span>
                        <Down className="expand-right" size={15} />
                    </div>
                    <div onClick={() => clickOut(<CustomStatus />)} className="your-opinion">
                        <span>Set Custom Status</span>
                    </div>
                </div>
                <div className="my-opinion">
                    <div onClick={() => clickOut(<ConfirmLogout />)} className="your-opinion">
                        <span>Logout</span>
                    </div>
                </div>
            </UserJSX>
            <div onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>{showStatusList && <StatusList position={{ bottom: 80, left: 370 }} />}</div>
        </OutSideListener>
    )
}

export default MyProfile