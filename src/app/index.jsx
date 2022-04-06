import { useState, createContext } from "react"
import Login from "./login/index.jsx"
import "./index.css"

export const Update = createContext()

function App() {
    const [state, setState] = useState(<Login />)

    return (
        <Update.Provider value={setState}>
            <div className="main">
                <a className="github-link" href="https://github.com/uwu404/discord-clone-client">view source code</a>
                {state}
            </div>
        </Update.Provider>
    )
}

export default App