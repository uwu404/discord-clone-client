import { useContext, useRef } from "react"
import { ScreenContext } from ".."
import Animate from "../../animate"
import { link } from "../../../config.json"

const setCustomStatus = (user, status) => {
    fetch(`${link}customstatus`, {
        method: "PATCH", 
        headers: {
            "Content-Type": "application/json",
            Authorization: user.token
        },
        body: JSON.stringify({
            customStatus: status
        })
    })
}


const CustomStatus = () => {
    const { user, setView } = useContext(ScreenContext)
    const inputRef = useRef()
    const buttonRef = useRef()
    const save = () => {
        setCustomStatus(user, inputRef.current.value)
        setView()
    }
    const submit = e => {
        e.preventDefault()
        buttonRef.current.click()
    }

    return (
        <Animate>
            <div className="generic-popup animated-popup custom-status">
                <h2 className="h2-82">Set a custom status</h2>
                <form className="set-custom-status" onSubmit={submit}>
                    <label htmlFor="9288" className="generic-label">WHAT'S COOKIN', {user.username.toUpperCase()}</label>
                    <input ref={inputRef} style={{ marginBottom: 15 }} type="text" id="9288" className="generic-input" placeholder="Support has arrived!" />
                    <label htmlFor="8292" className="generic-label">CLEAR AFTER</label>
                    <select className="generic-input" id="8292">
                        <option>Don't clear</option>
                    </select>
                </form>
                <div className="lower-section">
                    <button onClick={() => setView()} type="button" className="generic-button cancel">Cancel</button>
                    <button ref={buttonRef} onClick={save} type="submit" className="generic-button primary">Save</button>
                </div>
            </div>
        </Animate>
    )
}

export default CustomStatus