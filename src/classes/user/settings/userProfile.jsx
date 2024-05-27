import { useContext, useDeferredValue, useEffect, useRef, useState } from "react"
import { AppContext, UserContext } from "../../../app/message"
import isGif from "../../../global/isGif"
import Input from "../../../global/input"
import toBase64 from "../../../global/toBase64"
import SubComponent from "../../../global/editImage"
import UserJSX from "../miniProfile/user"

const UserProfile = ({ onChange, changes }) => {
    const { user } = useContext(UserContext)
    const { setLayer } = useContext(AppContext)
    const [src, setSrc] = useState(user.displayAvatarURL(90))
    const [color, setColor] = useState(user.profileColor)
    const [about, setAbout] = useState(user.about)
    const deferredColor = useDeferredValue(color)
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
                setLayer()
                setSrc(data)
                onChange(prev => Object.assign({}, prev, { src: data }))
            }
            const cancel = () => {
                setLayer()
            }
            setLayer(<SubComponent src={data} cancel={cancel} onComplete={complete} />)
        }
    }

    useEffect(() => {
        if (!changes.src) setSrc(user.displayAvatarURL(80))
        if (!changes.profileColor) setColor(user.profileColor)
        if (!("about" in changes)) setAbout(user.about)
    }, [changes, user])

    const handleColorChange = e => {
        setColor(e.target.value)
        onChange(prev => Object.assign({}, prev, { profileColor: e.target.value }))
    }

    const handleAboutChange = e => {
        setAbout(e.target.innerText)
        onChange(prev => ({ ...prev, about: e.target.innerText }))
    }

    const supportedImages = "image/gif,image/png,image/jpeg,image/webp"

    const assignedChanges = Object.assign({}, user, { displayAvatarURL() { return src }, profileColor: deferredColor, about })

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
                        <h5 className="preview-2">BANNER COLOR</h5>
                        <div className="profile-color-selector">
                            <div className="profile-color-option">
                                <div onClick={() => colorInput.current?.click()} style={{ backgroundColor: deferredColor }} className="custom-profileColor">
                                    <input defaultValue={user.profileColor} onChange={handleColorChange} ref={colorInput} style={{ visibility: "hidden" }} type="color" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="about-me user-color">
                        <h5 className="preview-2">ABOUT ME</h5>
                        <span className="text-info">you can't use mark down and links if you'd like</span>
                        <Input onChange={handleAboutChange} className="what-you-know-about-me" value={about || ""} />
                    </div>
                </div>
                <div className="section-561">
                    <h5 className="preview-2">PREVIEW</h5>
                    <UserJSX onClick={() => fileInput.current?.click()} editable style={{ position: "relative", animation: "none" }} user={assignedChanges} />
                </div>
                <input accept={supportedImages} style={{ display: "none" }} ref={fileInput} onChange={handleInputChange} type="file" />
            </div>
        </div>
    )
}

export default UserProfile