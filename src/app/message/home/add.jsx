import { useContext, useState } from "react"
import { link } from "../../../config.json"
import { UserContext } from ".."

const Add = () => {
    const { user } = useContext(UserContext)

    const [value, setValue] = useState("")
    const [text, setText] = useState(<p className="dumb-text-3">You can add a friend by their tag. It's CaSe SeNsiTive!</p>)

    const handleInputChange = (e) => setValue(e.target.value)

    const sendRequest = async () => {
        const [username, tag] = value.split("#")
        if (!username || !tag) return
        const res = await fetch(`${link}users/${username}&${tag}/request`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${user.token}`,
                "Content-Type": "application/json"
            }
        })

        if (res.ok) {
            return setText(<p style={{ color: "var(--green)" }} className="dumb-text-3">You send a friend request to {username + "#" + tag}</p>)
        }

        setText(<p style={{ color: "var(--red)" }} className="dumb-text-3">Failed to send a friend request to {username + "#" + tag}</p>)
    }

    return (
        <div className="invite">
            <h3 className="h3-add">ADD FRIEND</h3>
            {text}
            <div className="add-friend-input">
                <input autoComplete="off" maxLength="35" onChange={handleInputChange} placeholder="Enter a username#0000" />
                <div className="fake-after">{!value.includes("#") && value}</div>
                <button onClick={sendRequest} className={`send-friend-request primary generic-button ${value && "valid"}`}>Send Friend Request</button>
            </div>
        </div>
    )
}

export default Add