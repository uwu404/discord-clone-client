import { useState } from "react";
import Plus from "../../icons/plus";
import Animate from "../../app/animate";
import { link } from "../../config.json"

const Add = ({ view, onCreate, user }) => {
    const [clicked, setClicked] = useState("")
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const Creator = () => {
        const defaultName = `${user.username}'s server`
        const [value, setValue] = useState(defaultName)
        const [image, setImage] = useState(``)
        const [animation, setAnimation] = useState("bigger")

        const handleChange = async (e) => {
            toBase64(e.target.files[0])
                .then(data => setImage(data))
                .catch(console.log)
        }

        const del = () => {
            setClicked("")
            setAnimation("self-smaller")
            setTimeout(() => view(), 100)
        }

        const createServer = async () => {
            const server = await fetch(`${link}servers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: user.token,
                },
                body: JSON.stringify({
                    icon: image,
                    name: value
                })
            }).then(res => res.json())
            del()
            onCreate?.(server)
        }

        return (
            <Animate quit={() => setClicked("")}>
                <div className={`creator animated-popup ${animation}`}>
                    <div className="view-server">
                        <Plus onClick={del} size={25} />
                        <h2>Create a new Server</h2>
                        <p className="dummy-text">Create a new Server, customize it! Invite your friends to it. And have a good time.</p>
                        <div className="selector">
                            <img className="my-icon" alt="" src={image} />
                            <input onChange={handleChange} className="select-icon" type="file" />
                        </div>
                    </div>
                    <label htmlFor="server">SERVER NAME</label>
                    <input required name="server" defaultValue={defaultName} onChange={(event) => setValue(event.target.value)} className="select-server-name" />
                    <div style={{ backgroundColor: "rgb(231, 239, 247)" }} className="lower-section">
                        <button style={{ color: "black", marginRight: "auto", marginLeft: 0 }} onClick={del} className="generic-button cancel">Back</button>
                        <button onClick={createServer} className="generic-button primary">Create</button>
                    </div>
                </div>
            </Animate>
        )
    }

    const click = () => {
        setClicked("clicked")
        view(<Creator />)
    }

    return (
        <div className={`server-block ${clicked}`}>
            <div onClick={click} className="server">
                <div title="Add a Server" className="add-server">
                    <Plus size={23} />
                </div>
            </div>
            <div className="server-marker" />
        </div>
    )
}

export default Add