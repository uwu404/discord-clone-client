import { useContext, useRef, useState } from "react"
import { CreateServerContext } from "./createServer"
import toBase64 from "../../../global/toBase64"
import "./customizeServer.css"
import { UserContext } from "../../../app/message"

const CustomizeServer = () => {
    const transitionTo = useContext(CreateServerContext)
    const imageInput = useRef()
    const { user } = useContext(UserContext)
    const [icon, setIcon] = useState("")

    const handleChange = async (e) => {
        const data = await toBase64(e.target.files[0]).catch(console.log)
        setIcon(data)
    }

    return (
        <div className="your-server">
            <div className="pad-this">
                <h2 className="title-big">Customize Your Server</h2>
                <div style={{ marginLeft: 20, marginRight: 20 }} className="text-small">Give your new server a personality with a name and an icon. You can always change it later.</div>
                <form onSubmit={e => e.preventDefault()}>
                    <div className="customizing">
                        <div className="my-server-icon">
                            {!icon && <div onClick={() => imageInput.current.click()} className="upload"><div>UPLOAD</div></div>}
                            <img onClick={() => imageInput.current.click()} src={icon} className="my-icon" alt="" />
                            <input ref={imageInput} onChange={handleChange} className="select-icon" type="file" />
                        </div>
                    </div>
                    <div className="sub">
                        <label htmlFor="y-829z" className="that-label">SERVER NAME</label>
                        <input id="y-829z" className="invite-link" defaultValue={`${user.username}'s server`} />
                    </div>
                </form>
                <div className="leftist">
                    <div className="stupid-text">By creating a server you agree that i'm cool</div>
                </div>
            </div>
            <div className="l-section flex">
                <button onClick={transitionTo(0)} className="generic-button back-out cancel">Back</button>
                <button className="generic-button primary">Create</button>
            </div>
        </div>
    )
}

export default CustomizeServer