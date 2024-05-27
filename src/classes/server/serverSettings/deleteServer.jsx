import { useContext, useRef, useState } from "react"
import Animate from "../../../global/animate"
import { UserContext } from "../../../app/message"
import endpoints from "../../../global/endpoints"
import "./deleteServer.css"

const DeleteServer = ({ server }) => {
    const { user } = useContext(UserContext)
    const cancelButton = useRef()
    const inputRef = useRef()
    const [error, setError] = useState("")
    const endPoint = endpoints.deleteServer(server.id)

    const validateAction = () => {
        if (inputRef.current.value !== server.name) return setError("you didn't enter the server name correctly.")
        fetch(endPoint.endpoint, {
            method: endPoint.method,
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        })
    }

    return (
        <Animate element={cancelButton}>
            <div className={`animated-popup delete-server`}>
                <div className="upper-section">
                    <h2 className="ambatubedeleted">Delete Server</h2>
                    <div className="stupid-question">Are you sure you want to delete {server.name}? this action cannot be undone.</div>
                    <label htmlFor="xxy-8298-7272" className="generic-label">ENTER SERVER NAME</label>
                    <input ref={inputRef} className="generic-input" id="xxy-8298-7272" />
                    <span className="error-server">{error}</span>
                </div>
                <div className="lower-section">
                    <button ref={cancelButton} className="generic-button cancel">Cancel</button>
                    <button onClick={validateAction} className="generic-button error">Delete</button>
                </div>
            </div>
        </Animate>
    )
}

export default DeleteServer