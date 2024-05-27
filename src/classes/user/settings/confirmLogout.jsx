import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import Animate from "../../../global/animate"
import "./confirmLogout.css"

const ConfirmLogout = () => {
    const cancelButton = useRef()
    const navigate = useNavigate()
    const logout = () => {
        navigate("/login")
        localStorage.clear()
    }

    return (
        <Animate element={cancelButton}>
            <div className={`animated-popup c-logout`}>
                <h2 className="some-text">Confirm Logout</h2>
                <div className="dumb-question and-logout">
                    <span>Are you sure you want to logout?</span>
                </div>
                <div className="lower-section">
                    <button ref={cancelButton} className="generic-button cancel">Cancel</button>
                    <button className="generic-button error" onClick={logout}>Logout</button>
                </div>
            </div>
        </Animate>
    )
}

export default ConfirmLogout