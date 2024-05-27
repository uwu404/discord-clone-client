import { useContext, useRef, useState } from "react"
import Animate from "../../../global/animate"
import { AppContext } from "../../../app/message"

const EditUsername = ({ user, onChange }) => {
    const { setLayer } = useContext(AppContext)
    const [newName, setNewName] = useState(user.username)
    const changeUsername = e => {
        e.preventDefault()
        onChange(prev => Object.assign({}, prev, { username: newName }))
        setLayer()
    }
    const cancelButton = useRef()

    return (
        <Animate element={cancelButton}>
            <div style={{ width: 450, overflow: 'hidden', borderRadius: 5 }} className="edit-username generic-popup animated-popup">
                <h2 style={{ marginBottom: "0.5em" }}>Change your username</h2>
                <span style={{ color: "var(--font-secondary)", marginBottom: "0.6em" }} className="dumb-text-2">Enter a new username and your current password</span>
                <form style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                    <div className="content-wrapper">
                        <label className="generic-label" htmlFor="new-username">USERNAME</label>
                        <input onChange={e => setNewName(e.target.value)} autoComplete="off" style={{ marginBottom: "0.8em" }} type="text" defaultValue={user.username} id="new-username" className="new-username generic-input" />
                        <label className="generic-label" htmlFor="current-password">PASSWORD</label>
                        <input autoComplete="off" type="password" id="current-password" className="generic-input current-password" />
                    </div>
                    <div className="lower-section">
                        <button ref={cancelButton}  className="generic-button cancel">Cancel</button>
                        <button onClick={changeUsername} type="submit" className="generic-button primary">Done</button>
                    </div>
                </form>
            </div>
        </Animate>
    )
}

export default EditUsername
