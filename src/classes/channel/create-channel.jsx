import { useContext, useState } from "react";
import { ScreenContext } from "../../app/message";
import Plus from "../../icons/plus";
import { link } from "../../config.json"
import Hashtag from "../../icons/hashtag";
import Animate from "../../app/animate";

const CreateChannel = ({ server, quit }) => {
    const { user } = useContext(ScreenContext)
    const [settings, setSettings] = useState({ name: "", type: "text" })
    const [waiting, setWaiting] = useState("")

    const handleInputChange = (e) => setSettings(prev => ({ name: e.target.value, type: prev.type }))
    const selfAnimate = () => {
        setWaiting("self-smaller")
        setTimeout(() => quit(), 100)
    }

    const create = async () => {
        if (!settings.name) return
        setWaiting("waiting")
        await fetch(`${link}servers/${server.id}/channels`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: user.token
            },
            body: JSON.stringify(settings)
        })
        selfAnimate()
    }

    return (
        <Animate>
            <div className={`invite-people-div animated-popup ${waiting}`}>
                <div style={{ textAlign: 'center' }} className="part-1">
                    <h3 style={{ fontSize: '20px', marginTop: 30 }}>Create Text Channel</h3>
                    <Plus onClick={selfAnimate} size={25} />
                </div>
                <div className="check-boxes">
                    <h5>CHANNEL TYPE</h5>
                    <div className="check">
                        <div className="checker" />
                        <Hashtag size={28} />
                        <div className="channel-type">
                            <h4>Text Channel</h4>
                            <p>Post images, GIFs, opinions and puns</p>
                        </div>
                    </div>
                    <h5>CHANNEL NAME</h5>
                    <input onChange={handleInputChange} style={{ marginTop: 0, height: 35 }} className="change-server-name" />
                </div>
                <div className="lower-section">
                    <button onClick={selfAnimate} className="generic-button cancel">Cancel</button>
                    <button onClick={create} className={`generic-button success ${!settings.name && "cant-click"}`}>Create Channel</button>
                </div>
            </div>
        </Animate>
    )
}

export default CreateChannel
