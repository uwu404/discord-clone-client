import { useContext } from "react"
import toBase64 from "../../../global/toBase64"
import { serverContext } from "./serverSettings"

// I HATE THIS COMPONENT SO MUCH
const EditServer = () => {
    const { setChanges, changes, server } = useContext(serverContext)

    const handleNameChange = e => setChanges(prev => ({ ...prev, name: e.target.value }))

    const handleFileChange = async e => {
        const file = e.target.files[0]
        const data = await toBase64(file).catch(() => 0)
        if (data) setChanges(prev => ({ ...prev, icon: data }))
    }

    return (
        <div>
            <h2 className="my-account-header">Overview</h2>
            <div className="section-420">
                <div className="server-edit-icon">
                    <div className="lorem">
                        {changes.icon ?
                            <img className="server-icon-img" height="100" width="100" src={changes.icon.startsWith("data") ? changes.icon : server.displayIcon(100)} alt="icon" /> :
                            <div className="server-icon-img">{changes.name[0]}</div>
                        }
                        <span className="ipsum">100x100</span>
                    </div>
                    <div className="block-nomargin">
                        <p className="recommendation">We recommend an image of atleast 200x200 for the server.</p>
                        <label className="upload-button" htmlFor="xx3">Upload Image</label>
                        <input id="xx3" name="upload" className="upload-file" onChange={handleFileChange} type="file" />
                    </div>
                </div>
                <div className="server-info">
                    <label className="generic-label" htmlFor="bruh">SERVER NAME</label>
                    <input className="change-server-name" onChange={handleNameChange} name="bruh" value={changes.name || ""} />
                </div>
            </div>
            <div className="seperator"></div>
        </div>
    )
}

export default EditServer