import { useContext } from "react"
import { CreateServerContext } from "./createServer"
import "./joinServer.css"

const AlreadyHasInvite = () => {
    const transitionTo = useContext(CreateServerContext)

    return (
        <div className="your-server">
            <div className="pad-this">
                <h2 className="title-big">Join Server</h2>
                <div className="text-small">Enter An Invite Link Below To Join An Existing Server</div>
                <form onSubmit={e => e.preventDefault()}>
                    <div className="sub">
                        <label htmlFor="y-828z" className="that-label">INVITE LINK *</label>
                        <input id="y-828z" className="invite-link" defaultValue="server/kys420" />
                    </div>
                </form>
                <div className="sub">
                    <h3 className="that-label">INVITES SHOULD LOOK LIKE</h3>
                    <div className="invite-examples">
                        <div className="invite-sample"><span>kys420</span></div>
                        <div className="invite-sample"><span>server/kys420</span></div>
                    </div>
                </div>
            </div>
            <div className="l-section flex">
                <button onClick={transitionTo(0)} className="generic-button cancel back-out">Back</button>
                <button className="generic-button primary"> Join Server</button>
            </div>
        </div>
    )
}

export default AlreadyHasInvite