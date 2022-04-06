import { useContext, useState } from "react";
import { ScreenContext } from "../../app/message"
import Utils from "../../utils"
import { link } from "../../config.json"

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const img = new Image()
        img.onload = () => resolve(reader.result);
        img.src = reader.result
    }
    reader.onerror = error => reject(error);
});

// I HATE THIS COMPONENT SO MUCH
const EditServer = ({ server, animation, quit }) => {
    const [src, setSrc] = useState(server.displayIcon(100, 100))
    const [name, setName] = useState("")
    const { user } = useContext(ScreenContext)
    const handleNameChange = e => setName(e.target.value)
    const handleFileChange = async e => {
        const file = e.target.files[0]
        const data = await toBase64(file).catch(() => 0)
        if (data) setSrc(data)
    }
    const save = () => {
        fetch(`${link}server/${server.id}`, {
            method: "PATCH",
            body: JSON.stringify({ icon: src, name }),
            headers: {
                "Content-Type": "application/json",
                Authorization: user.token
            }
        })
    }

    return (
        <div className={`dark-div ${animation}`}>
            <Utils.Out click={quit}>
                <div className={`edit-server ${animation}`}>
                    <div className="server-edit-icon">
                        <img height="100" width="100" src={src} alt="icon" />
                        <label className="upload-button" htmlFor="xx3">Upload Image</label>
                        <input id="xx3" name="upload" className="upload-file" onChange={handleFileChange} type="file"/>
                    </div>
                    <div className="server-info">
                        <h3>Edit Server</h3>
                        <label htmlFor="bruh">SERVER NAME</label>
                        <input className="change-server-name" onChange={handleNameChange} name="bruh" defaultValue={server.name} />
                        <button onClick={save}>Save</button>
                    </div>
                </div>
            </Utils.Out>
        </div>
    )
}

export default EditServer