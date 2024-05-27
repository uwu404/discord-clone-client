import { useContext } from "react"
import "./yourServer.css"
import { CreateServerContext } from "./createServer"

const YourServer = () => {
    const transitionTo = useContext(CreateServerContext)

    return (
        <div className="your-server">
            <div className="pad-this">
                <h2 className="title-big">Create a Server</h2>
                <div className="text-small">Your server is where you and your friends hang out. Make yours and start talking.</div>
                <div>
                    <button onClick={transitionTo(2)} className="create-my-own">
                        <span>Create My Own</span>
                    </button>
                </div>
            </div>
            <div className="already-invited l-section">
                <div className="join-it">Already Have An Invite?</div>
                <button onClick={transitionTo(1)} className="join-a-server">Join A Server</button>
            </div>
        </div>
    )
}

export default YourServer