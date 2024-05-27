import { useContext, useId, useRef } from "react"
import { UserContext } from "../../../app/message"
import endpoints from "../../../global/endpoints"
import { serverContext } from "./serverSettings"
import "./customInvite.css"

const CustomInvite = () => {
    const { server } = useContext(serverContext)
    const { user } = useContext(UserContext)
    const id = useId()
    const inputRef = useRef()
    const endpoint = endpoints.createCustomInvite(server.id)

    const save = () => {
        if (inputRef.current.value.length < 4) return
        fetch(endpoint.endPoint, {
            method: endpoint.method,
            headers: {
                Authorization: `Bearer ${user.token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                invite: inputRef.current.value
            })
        })
    }

    return (
        <div>
            <h2 className="my-account-header">Custom Invite Link</h2>
            <div className="custom-invite">
                <p>Make your server easily accessible with a fancy Custom Invite Link of your choosing. Be aware that this makes your server publicly available to anyone who uses this link.</p>
                <p>Remember that Custom Invite Links require one text channel to be accessible to all members in order to work.</p>
                <div className="custom-invite-creator">
                    <div className="flex-ww7z">
                        <label className="generic-label invite-c1" htmlFor={id}>INVITE CODE</label>
                        <span className="editor-text invite-s">Press Enter To <span className="purple-link" onClick={save}>Save</span></span>
                    </div>
                    <div className="container-xxv4">
                        <div className="padding-1">
                            <div>server/</div>
                        </div>
                        <input autoComplete="off" onKeyDown={k => k.code === "Enter" && save()} className="generic-input invite-c2" id={id} ref={inputRef} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomInvite