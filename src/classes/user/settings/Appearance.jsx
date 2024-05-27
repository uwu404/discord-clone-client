import { useContext } from "react"
import { UserContext } from "../../../app/message"
import MessageJSX from "../../message/message"
import Message from "../../message"
import CustomRangeInput from "../../../global/customRangeInput"
import { SettingsContext } from "../../../app"

const Appearance = () => {
    const { user } = useContext(UserContext)
    const preferredSettings = useContext(SettingsContext)
    const switchTo = (theme) => () => {
        preferredSettings.setPreferredSettings(prev => ({ ...prev, theme }))
        localStorage.setItem("theme", theme)
    }
    const setFontSizeTo = e => {
        preferredSettings.setPreferredSettings(prev => ({ ...prev, fontSize: e.target.value }))
        localStorage.setItem("fontSize", e.target.value)
    }

    const now = Date.now()
    const dummyMessage1 = new Message({ author: user, content: "Waiting for the day when...\nwhen voice channels actually work", createdAt: now, updatedAt: now })
    const dummyMessage2 = new Message({ author: user, content: "Yeah that'll never work", createdAt: now, updatedAt: now })

    return (
        <div>
            <h2 className="my-account-header">Appearance</h2>
            <div className="dummy-messages">
                <MessageJSX noClicking full={true} message={dummyMessage1} />
                <MessageJSX noClicking message={dummyMessage2} full={true} />
            </div>
            <h5 className="preview-2">THEME</h5>
            <div className="check-list">
                <div className={`theme-check dark ${preferredSettings.preferredSettings.theme === "dark" && "checked"}`} onClick={switchTo("dark")}></div>
                <div className={`theme-check light ${preferredSettings.preferredSettings.theme === "light" && "checked"}`} onClick={switchTo("light")}></div>
            </div>
            <div className="text-resize user-color">
                <h5 className="preview-2">CHAT FONT SCALING</h5>
                <div>
                    <CustomRangeInput className="range-slider" min={14} max={20} defaultValue={preferredSettings.preferredSettings.fontSize} onChange={setFontSizeTo} type="range" />
                </div>
            </div>
        </div>
    )
}

export default Appearance