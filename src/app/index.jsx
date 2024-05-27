import Login from "./login/index.jsx"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import "./index.css"
import Signup from "./signup/index.jsx"
import Error from "./errorPage/errorPage.jsx"
import Render from "./loadingPage/render.jsx"
import { createContext, useMemo, useState } from "react"

export const SettingsContext = createContext()

const App = () => {
    const [preferredSettings, setPreferredSettings] = useState({
        theme: localStorage.getItem("theme") || "light",
        fontSize: localStorage.getItem("fontSize") || 15
    })

    const settings = useMemo(() => {
        return { preferredSettings, setPreferredSettings }
    }, [preferredSettings])

    return (
        <BrowserRouter>
            <SettingsContext.Provider value={settings}>
                <div className={`main ${preferredSettings.theme}`}>
                    <a className="github-link" href="https://github.com/uwu404/discord-clone-client">view source code</a>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/sign-up" element={<Signup />} />
                        <Route path="/channels/:server/:channel?" element={<Render />} />
                        <Route path="/" element={<Navigate to="/channels/@me" />} />
                        <Route path="*" element={<Error />} />
                    </Routes>
                </div>
            </SettingsContext.Provider>
        </BrowserRouter>
    )
}

export default App