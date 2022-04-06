import { useState, useContext, useMemo, useRef, useEffect } from "react"
import Login from "../../app/login"
import { ScreenContext } from "../../app/message"
import { Update } from "../../app"
import SubComponent from "../../global/editImage"
import isGif from "../../global/isGif"
import "./userSettings.css"
import User from "."
import Plus from "../../icons/plus"
import Animate from "../../app/animate"
import UserJSX from "./user"
import Avatar from "../../global/avatar"

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
        const img = new Image()
        img.onload = () => resolve(reader.result)
        img.src = reader.result
    }
    reader.onerror = error => reject(error)
})

const EditUsername = ({ user, onChange }) => {
    const { setView } = useContext(ScreenContext)
    const [newName, setNewName] = useState(user.username)
    const changeUsername = e => {
        e.preventDefault()
        onChange(prev => Object.assign({}, prev, { username: newName }))
        setView()
    }
    const cancel = () => setView()

    return (
        <Animate>
            <div style={{ width: 450, overflow: 'hidden', borderRadius: 5 }} className="edit-username generic-popup animated-popup">
                <h2 style={{ marginBottom: "0.5em" }}>Change your username</h2>
                <span style={{ color: "var(--font-secondary)", marginBottom: "0.6em" }} className="dumb-text-2">Enter a new username and your current password</span>
                <form style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                    <div className="content-wrapper">
                        <label className="generic-label" htmlFor="new-username">USERNAME</label>
                        <input onChange={e => setNewName(e.target.value)} autoComplete="off" style={{ marginBottom: "0.8em" }} type="text" defaultValue={user.username} id="new-username" className="new-username generic-input" />
                        <label className="generic-label" htmlFor="current-password">PASSWORD</label>
                        <input autoComplete="off" type="password" id="current-password" className="generic-input current-password" />
                    </div>
                    <div className="lower-section">
                        <button onClick={cancel} type="button" className="generic-button cancel">Cancel</button>
                        <button onClick={changeUsername} type="submit" className="generic-button primary">Done</button>
                    </div>
                </form>
            </div>
        </Animate>
    )
}

const MyAccount = ({ user, setButton, onChange, changes }) => {
    const { setView } = useContext(ScreenContext)
    const click = () => setView(<EditUsername onChange={onChange} user={user} />)

    return (
        <div className="my-account">
            <h2 className="my-account-header">My Account</h2>
            <div className="my-settings">
                <div style={{ backgroundColor: user.profileColor }} className="profile-color"></div>
                <div className="section-17">
                    <div className="section-721">
                        <div className="my-avatar-wrapper">
                            <Avatar status={"online"} size={80} src={user.displayAvatarURL(90)}/>
                        </div>
                        <h5 className="username-382">{changes.username || user.username}</h5>
                        <button onClick={setButton(1)} style={{ marginLeft: "auto" }} className="generic-button primary button-121">Edit User Profile</button>
                    </div>
                    <div className="section-832">
                        <div className="username-77 flex-line">
                            <div>
                                <h5 className="field-title">USERNAME</h5>
                                <div className="div-410"><span>{changes.username || user.username}</span><span className="text-info">{user.tag}</span></div>
                            </div>
                            <button onClick={click} style={{ color: "var(--font-primary)", marginLeft: "auto" }} className="generic-button secondary">Edit</button>
                        </div>
                        <div className="email-10 flex-line">
                            <div>
                                <h5 className="field-title">EMAIL</h5>
                                <div className="div-410">{user.email}</div>
                            </div>
                        </div>
                        <div className="phone-number-47 flex-line">
                            <div>
                                <h5 className="field-title">PHONE NUMBER</h5>
                                <div className="text-info">This app doesn't support phone numbers</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const UserProfile = ({ user, onChange, changes }) => {
    const { setView, user: me } = useContext(ScreenContext)
    const [src, setSrc] = useState(user.displayAvatarURL(90))
    const [color, setColor] = useState(user.profileColor)
    const fileInput = useRef()
    const colorInput = useRef()
    const handleInputChange = async (e) => {
        const file = e.target.files[0]
        const data = await toBase64(file).catch(() => 0)
        e.target.value = ""
        if (!data) return
        if (isGif(data)) {
            onChange(prev => Object.assign({}, prev, { src: data }))
            return setSrc(data)
        }
        if (data) {
            const complete = data => {
                setView()
                setSrc(data)
                onChange(prev => Object.assign({}, prev, { src: data }))
            }
            const cancel = () => {
                setView()
                setSrc(user.displayAvatarURL(150))
            }
            setView(<SubComponent src={data} cancel={cancel} onComplete={complete} />)
        }
    }

    useEffect(() => {
        const oldUser = new User(me)
        if (!changes.src) setSrc(oldUser.displayAvatarURL(80))
        if (!changes.profileColor) setColor(oldUser.profileColor)
    }, [changes, me])

    const handleColorChange = e => {
        setColor(e.target.value)
        onChange(prev => Object.assign({}, prev, { profileColor: e.target.value }))
    }

    const goToDefault = () => onChange(prev => Object.assign({}, prev, { profileColor: "#000" }))

    const supportedImages = "image/gif,image/png,image/jpeg,image/webp"

    return (
        <div className="user-profile">
            <h2 className="my-account-header">User Profile</h2>
            <div className="section-559">
                <div className="section-560">
                    <div className="section-700">
                        <h5 className="preview-2">AVATAR</h5>
                        <button onClick={() => fileInput.current?.click()} style={{ marginLeft: 0 }} className="generic-button primary">Change Avatar</button>
                    </div>
                    <div className="user-color">
                        <h5 className="preview-2">PROFILE COLOR</h5>
                        <div className="profile-color-selector">
                            <div className="profile-color-option">
                                <div onClick={goToDefault} className="default-profileColor"></div>
                                <span>Default</span>
                            </div>
                            <div className="profile-color-option">
                                <div onClick={() => colorInput.current?.click()} style={{ backgroundColor: color }} className="custom-profileColor">
                                    <input defaultValue={user.profileColor} onChange={handleColorChange} ref={colorInput} style={{ visibility: "hidden" }} type="color" />
                                </div>
                                <span>Custom</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section-561">
                    <h5 className="preview-2">PREVIEW</h5>
                    <UserJSX onClick={() => fileInput.current?.click()} editable style={{ position: "relative", animation: "none" }} user={Object.assign({}, user, { displayAvatarURL() { return src }, profileColor: color })} />
                </div>
                <input accept={supportedImages} style={{ display: "none" }} ref={fileInput} onChange={handleInputChange} type="file" />
            </div>
        </div>
    )
}

const Appearance = () => {
    const { setTheme } = useContext(ScreenContext)
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme") || "light")
    const switchTo = (theme) => () => {
        setTheme(theme)
        localStorage.setItem("theme", theme)
        setCurrentTheme(theme)
    }
    return (
        <div>
            <h2 className="my-account-header">Appearance</h2>
            <h5 className="preview-2">THEME</h5>
            <div className="check-list">
                <div className="check" onClick={switchTo("dark")}>
                    <div className={`checker ${currentTheme !== "dark" && "unchecked"}`}></div>
                    <h5 className="generic-header-5">Dark</h5>
                </div>
                <div className="check" onClick={switchTo("light")}>
                    <div className={`checker ${currentTheme !== "light" && "unchecked"}`}></div>
                    <h5 className="generic-header-5">Light</h5>
                </div>
            </div>
        </div>
    )
}

const Render = ({ componentId, user, setButton, onChange, changes }) => {
    switch (componentId) {
        case 0: return <MyAccount changes={changes} onChange={onChange} setButton={setButton} user={user} />
        case 1: return <UserProfile changes={changes} onChange={onChange} user={user} />
        case 2: return <Appearance />
        default: return null
    }
}


const UserSettings = () => {
    const { setShowSettings, setUser, user: me } = useContext(ScreenContext)
    const user = useMemo(() => new User(me), [me])
    const [changes, setChanges] = useState({})
    const [button, setButton] = useState(0)
    const [animation, setAnimation] = useState("")
    const update = useContext(Update)

    const logout = () => update(<Login update={update} />)

    const edit = () => {
        if (!Object.keys(changes).length) return
        user.edit(changes.username, changes.src, changes.profileColor).then(u => {
            setUser(Object.assign({}, user, u))
            setChanges({})
        })
    }

    const reset = () => setChanges({})

    const quit = () => {
        setAnimation("is-being-removed")
        setShowSettings("")
        setTimeout(() => setShowSettings(false), 140)
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
            <div className="main-content">
                <div className="parameters">
                    <Render changes={changes} onChange={setChanges} setButton={getButton} componentId={button} user={user} />
                    <div className="edit-check">
                        <div style={{ overflow: "hidden" }}>
                            <div className={`confirm-edit ${!!Object.keys(changes).length && "is-edited"}`}>
                                <span className="dumb-text">Careful - you have unsaved changes!</span>
                                <button onClick={reset} className="reset generic-button cancel">Reset</button>
                                <button className="generic-button success" onClick={edit}>Save Changes</button>
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