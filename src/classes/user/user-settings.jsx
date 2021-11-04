import { useState, useEffect, useContext } from "react"
import Utils from "../../utils"
import Login from "../../app/login"
import { ThemeContext } from "../../app/message"

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

function UserSettings({ user, name, onClickOut, onEdit, onSave }) {
    const [src, setSrc] = useState(user.displayAvatarURL(150))
    const [email, setEmail] = useState(user.email)
    const [password, setPassword] = useState({ password: user.password, reveal: false })
    const [username, setUsername] = useState(user.username)
    const [edited, setEdited] = useState(false)
    const setTheme = useContext(ThemeContext)

    useEffect(() => {
        if (
            (password.password === user.password && email === user.email && username === user.username && src === user.displayAvatarURL(150)) ||
            (!password.password || !email || !username || !src)
        ) setEdited(false)
        else setEdited(true)
    }, [password.password, email, username, src, user])

    const handleInputChange = async (e) => {
        const file = e.target.files[0]
        const data = await toBase64(file).catch(() => 0)
        if (data) setSrc(data)
    }

    const revealPassword = () => setPassword(prev => ({ password: prev.password, reveal: !prev.reveal }))

    const Logout = () => user.update(<Login update={user.update} />)

    const edit = () => {
        if (!edited) return
        onSave()
        setEdited(false)
        user.edit(username, src).then(u => onEdit(Object.assign(user, u)))
    }

    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme") || "light")
    const switchTo = (theme) => () => {
        setTheme(theme)
        localStorage.setItem("theme", theme)
        setCurrentTheme(theme)
    }

    const supportedImages = "image/gif,image/png,image/jpeg,image/webp"

    return (
        <div className="dark-div">
            <Utils.Out click={onClickOut}>
                <div className={`user-settings ${name} ${!edited && "is-not-edited"}`}>
                    <div className="user-overview">
                        <div className="avatar-div">
                            <div className="user-avatar-selector">
                                <img width="150" height="150" src={src} alt="avatar" className="view-avatar" />
                                <input accept={supportedImages} onChange={handleInputChange} type="file" className="avatar-config" />
                            </div>
                        </div>
                        <div className="overview">
                            <h2 className="label">USERNAME</h2>
                            <h3 placeholder="no username" className="view-username">{username}</h3>
                            <h2 className="label">EMAIL</h2>
                            <h3 placeholder="no email" className="view-email">{email}</h3>
                            <h2 className="label">PASSWORD</h2>
                            <h3 placeholder="no password" onClick={revealPassword} className="view-password">{password.reveal ? password.password : "*".repeat(password.password.length)}</h3>
                            <button onClick={Logout} className="logout">Logout</button>
                        </div>
                    </div>
                    <div className="user-editor">
                        <h2 className="customize">Customize your profile</h2>
                        <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} defaultValue={user.username} maxLength="25" type="text" />
                        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} defaultValue={user.email} type="email" />
                        <input placeholder="Password" onChange={(e) => setPassword(prev => ({ password: e.target.value, reveal: prev.reveal }))} maxLength="25" defaultValue={password.password} type="password" />
                        <h2 className="customize">Theme</h2>
                        <div onClick={switchTo("light")} className={`light-theme ${currentTheme}`}>LIGHT</div>
                        <div onClick={switchTo("dark")} className={`dark-theme ${currentTheme}`}>DARK</div>
                        <button onClick={onClickOut} className="cancel-profile">Cancel</button>
                        <button onClick={edit} className="save-profile">Save</button>
                        <button className="logout-2" onClick={Logout}>Logout</button>
                    </div>
                </div>
            </Utils.Out>
        </div>
    )
}

export default UserSettings