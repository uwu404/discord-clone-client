import { useContext, useId, useRef, useState } from "react";
import { UserContext } from "../../app/message";
import Plus from "../../assets/plus";
import { link } from "../../config.json"
import Animate from "../../global/animate";
import ChannelIcon from "./channelIcon";

const ChannelType = ({ type, selected, select }) => {
    const descriptions = {
        "text": "Post images, GIFs, opinions and puns.",
        "voice": "Hangout together with voice, video and screen share."
    }

    return (
        <div onClick={() => select(prev => ({ ...prev, type }))} className={`check ${selected ? "checked" : ""}`}>
            <ChannelIcon size={28} type={type} />
            <div className="channel-type">
                <h4>{type[0].toUpperCase() + type.slice(1)} Channel</h4>
                <p>{descriptions[type]}</p>
            </div>
            <div className={`checker ${selected ? "" : "unchecked"}`} />
        </div>
    )
}

const CreateChannel = ({ server }) => {
    const id = useId()
    const { user } = useContext(UserContext)
    const [settings, setSettings] = useState({ name: "", type: "text" })
    const [isWaiting, setIsWaiting] = useState(false)
    const cancelButtons = useRef([])

    const handleInputChange = (e) => setSettings(prev => ({ name: e.target.value, type: prev.type }))

    const create = async () => {
        if (!settings.name) return
        setIsWaiting(true)
        await fetch(`${link}servers/${server.id}/channels`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify(settings)
        })
        cancelButtons.current[0].click()
    }

    return (
        <Animate element={cancelButtons}>
            <div className={`create-channel animated-popup ${isWaiting && "waiting"}`}>
                <div className="roblox">
                    <div className="i-62">
                        <h3 className="title-channel">Create Channel</h3>
                        <div className="exit" ref={el => cancelButtons.current[1] = el}>
                            <Plus size={25} />
                        </div>
                    </div>
                    <div className="check-boxes">
                        <h5 className="grammar generic-label">CHANNEL TYPE</h5>
                        <ChannelType select={setSettings} selected={settings.type === "text"} type="text" />
                        <ChannelType select={setSettings} selected={settings.type === "voice"} type="voice" />
                    </div>
                    <div className="my-fav-dog">
                        <label htmlFor={id} className="grammar generic-label">CHANNEL NAME</label>
                        <input id={id} onChange={handleInputChange} style={{ marginTop: 0, height: 35 }} className="generic-input" />
                    </div>
                </div>
                <div className="lower-section">
                    <button ref={el => cancelButtons.current[0] = el} className="generic-button cancel">Cancel</button>
                    <button onClick={create} className={`generic-button primary ${!settings.name && "cant-click"}`}>Create Channel</button>
                </div>
            </div>
        </Animate>
    )
}

export default CreateChannel
