import { useRef, useState } from "react"
import "./index.css"
import Signup from "../signup"
import { link } from "../../config.json"
import Message from "../message"

function Login({ update }) {
    const [animation, expand] = useState("")
    const [error, setError] = useState("")
    const signUp = () => {
        expand("expand-me")
        setTimeout(() => update(<Signup update={update} />), 200)
    }
    const password = useRef()
    const email = useRef()

    const login = (e) => {
        e.preventDefault()
        if (!password.current.value || !email.current.value) return
        expand("waiting")
        fetch(`${link}user?password=${password.current.value}&email=${email.current.value}`).then(res => res.json())
            .then(user => {
                expand("expand-all")
                setTimeout(() => update(<Message user={user} update={update} />), 300)
            })
            .catch(err => {
                expand("")
                setError(err.toString())
            })

    }

    return (
        <div className={`login ${animation}`}>
            <h2 className="login-text">Login to continue</h2>
            <form name="login">
                <input id="email" ref={email} className="login-input email" required autoComplete="on" type="email" placeholder="Email" />
                <input id="password" ref={password} autoComplete="on" required className="login-input password" type="password" placeholder="Password" />
                <p className="no-account">Don't have an account? <span onClick={signUp}>create one</span></p>
                <button type="submit" onClick={login} className="button-login sign-up">Login</button>
            </form>
            <p className="error-message">{error}</p>
        </div>
    )
}

export default Login