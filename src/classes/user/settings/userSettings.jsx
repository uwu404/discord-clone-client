import { useState, useContext } from "react"
import { AppContext, UserContext } from "../../../app/message"
import "./userSettings.css"
import endpoints from "../../../global/endpoints"
import Plus from "../../../assets/plus"
import ConfirmLogout from "./confirmLogout"
import MyAccount from "./myAccount"
import UserProfile from "./userProfile"
import Appearance from "./Appearance"

const Render = ({ componentId, user, setButton, onChange, changes }) => {
    switch (componentId) {
        case 0: return <MyAccount changes={changes} onChange={onChange} setButton={setButton} />
        case 1: return <UserProfile changes={changes} onChange={onChange} user={user} />
        case 2: return <Appearance />
        default: return null
    }
}

const UserSettings = () => {
    const { setUser, user } = useContext(UserContext)
    const { setLayer, setShowSettings } = useContext(AppContext)
    const [changes, setChanges] = useState({})
    const [button, setButton] = useState(0)
    const [animation, setAnimation] = useState("")
    const editUserEndPoint = endpoints.editUser()

    const logout = () => setLayer(<ConfirmLogout />)

    const save = async () => {
        const savedUser = await fetch(editUserEndPoint.endPoint, {
            method: editUserEndPoint.method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify({
                username: changes.username,
                data: changes.src,
                profileColor: changes.profileColor,
                about: changes.about
            })
        }).then(res => res.json())
            .catch(console.log)
        setUser(prev => ({ ...prev, ...savedUser }))
        setChanges({})
    }

    const reset = () => setChanges({})

    const quit = () => {
        setAnimation("is-being-removed")
        setShowSettings("")
        setTimeout(() => setShowSettings(false), 150)
    }

    const getButton = (button) => () => !Object.keys(changes).length && setButton(button)
    const isClicked = (btn) => `generic-button ${btn === button && "clicked"}`

    return (
        <div className={`settings ${animation}`}>
            <div className="settings-left">
                <div className="scrollable-content">
                    <nav className="navigate-settings">
                        <div>
                            <h5 className="generic-label header-82">USER SETTINGS</h5>
                            <button onClick={getButton(0)} className={isClicked(0)}>My Account</button>
                            <button onClick={getButton(1)} className={isClicked(1)}>User Profile</button>
                            <div className="seperator"></div>
                            <h5 className="generic-label header-82">APP SETTINGS</h5>
                            <button onClick={getButton(2)} className={isClicked(2)}>Appearance</button>
                            <button onClick={logout} className="generic-button error">Logout</button>
                        </div>
                    </nav>
                </div>
            </div>
            <div className="main-content stylish-scrollbar">
                <div className="parameters">
                    <div className="bfg">
                        <Render changes={changes} onChange={setChanges} setButton={getButton} componentId={button} user={user} />
                        <div className="edit-check">
                            <div>
                                <div className={`confirm-edit ${!!Object.keys(changes).length && "is-edited"}`}>
                                    <span className="dumb-text">Careful - you have unsaved changes!</span>
                                    <button onClick={reset} className="reset generic-button cancel">Reset</button>
                                    <button className="generic-button success" onClick={save}>Save Changes</button>
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

export default UserSettings