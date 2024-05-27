import { createContext, useContext, useRef, useState } from "react"
import { AppContext, UserContext } from "../../../app/message"
import Plus from "../../../assets/plus"
import EditServer from "./serverEditor"
import DeleteServer from "./deleteServer"
import endpoints from "../../../global/endpoints"
import CustomInvite from "./customInvite"

const Render = ({ elementId }) => {
    switch (elementId) {
        case 0: return <EditServer />
        case 1: return <CustomInvite />
        default: return null
    }
}

export const serverContext = createContext()

const ServerSettings = ({ server }) => {
    const { setShowSettings, setLayer } = useContext(AppContext)
    const initialValue = useRef({ icon: server.icon, name: server.name, isChanging: false })
    const [changes, setChanges] = useState({ icon: server.icon, name: server.name })
    const [animation, setAnimation] = useState("")
    const [button, setButton] = useState(0)
    const editServerEndPoint = endpoints.editServer(server.id)
    const { user } = useContext(UserContext)

    const quit = () => {
        setAnimation("is-being-removed")
        setShowSettings(0)
        setTimeout(() => setShowSettings(false), 150)
    }

    const deleteServer = () => setLayer(<DeleteServer server={server} />)

    const clickButton = b => () => setButton(b)
    const checkButton = b => b === button && "clicked"

    const isChanged = Object.keys(changes).map(key => {
        return initialValue.current[key] === changes[key]
    }).includes(false)

    const reset = () => setChanges({ icon: server.icon, name: server.name })

    const save = async () => {
        if (initialValue.current.isChanging) return
        initialValue.current.isChanging = true
        fetch(editServerEndPoint.endPoint, {
            method: editServerEndPoint.method,
            body: JSON.stringify(changes),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`
            }
        }).then(res => res.json())
            .then(newserver => {
                initialValue.current.name = newserver.name
                initialValue.current.icon = newserver.icon
                initialValue.isChanging = false
                setChanges({ icon: newserver.icon, name: newserver.name })
            })
    }

    if (!server) return null
    return (
        <div className={`settings ${animation}`}>
            <div className="settings-left">
                <div className="scrollable-content">
                    <nav className="navigate-settings">
                        <div>
                            <h5 className="generic-label header-82">{server.name.toUpperCase()}</h5>
                            <button onClick={clickButton(0)} className={`generic-button ${checkButton(0)}`}>Overview</button>
                            <button onClick={clickButton(1)} className={`generic-button ${checkButton(1)}`}>Custom Invite Link</button>
                            <div className="seperator"></div>
                            <button onClick={deleteServer} className={`generic-button`}>Delete Server</button>
                        </div>
                    </nav>
                </div>
            </div>
            <div className="main-content stylish-scrollbar">
                <div className="parameters">
                    <div className="bfg">
                        <serverContext.Provider value={{ server, setChanges, changes }}>
                            <Render setChanges={setChanges} server={server} elementId={button} />
                        </serverContext.Provider>
                        <div className="edit-check">
                            <div>
                                <div className={`confirm-edit ${isChanged && "is-edited"}`}>
                                    <span className="dumb-text">Careful - you have unsaved changes!</span>
                                    <button onClick={reset} className="reset generic-button cancel">Reset</button>
                                    <button onClick={save} className="generic-button success">Save Changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div onClick={quit} className="return"><Plus size={17} /></div>
            </div>
        </div>
    )
}

export default ServerSettings