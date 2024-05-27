import { useContext, useRef } from "react"
import Animate from "../../../global/animate"
import { link } from "../../../config.json"
import { AppContext, UserContext } from "../../../app/message"
import "./customStatus.css"

const setCustomStatus = async (user, status) => {
    return await fetch(`${link}customstatus`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
            customStatus: status
        })
    })
        .then(res => res.json())
}


const CustomStatus = () => {
    const { user, setUser } = useContext(UserContext)
    const { setLayer } = useContext(AppContext)
    const inputRef = useRef()
    const buttonRef = useRef()
    const cancelButton = useRef()

    const save = async () => {
        setLayer()
        const { customStatus } = await setCustomStatus(user, inputRef.current.value)
        setUser(prev => ({ ...prev, customStatus }))
    }

    const submit = e => {
        e.preventDefault()
        buttonRef.current.click()
    }

    return (
        <Animate element={cancelButton}>
            <div className="generic-popup animated-popup custom-status">
                <h2 className="h2-82">Set a custom status</h2>
                <form className="set-custom-status" onSubmit={submit}>
                    <label htmlFor="9288" className="generic-label">WHAT'S COOKIN', {user.username.toUpperCase()}</label>
                    <input defaultValue={user.customStatus || ""} ref={inputRef} style={{ marginBottom: 15 }} type="text" id="9288" className="generic-input" placeholder="Support has arrived!" />
                    <label htmlFor="8292" className="generic-label">CLEAR AFTER</label>
                    <select className="generic-input" id="8292">
                        <option>Don't clear</option>
                    </select>
                </form>
                <div className="lower-section">
                    <button ref={cancelButton} className="generic-button cancel">Cancel</button>
                    <button ref={buttonRef} onClick={save} type="submit" className="generic-button primary">Save</button>
                </div>
            </div>
        </Animate>
    )
}

export default CustomStatus