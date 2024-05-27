import { useRef, useState } from "react"
import "./index.css"
import { useNavigate } from "react-router-dom"
import endpoints from "../../global/endpoints"

const Login = () => {
    const [animation, expand] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const { endPoint, method } = endpoints.login()
    const password = useRef()
    const email = useRef()

    const signUp = () => {
        expand("expand-me")
        setTimeout(() => navigate("/sign-up"), 200)
    }

    const login = (e) => {
        e.preventDefault()
        if (!password.current.value || !email.current.value) return
        expand("waiting")
        fetch(endPoint, {
            method,
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: password.current.value,
                email: email.current.value
            })
        })
            .then(res => res.json())
            .then(({ accessToken, error }) => {
                if (error) {
                    expand("")
                    return setError(error)
                }
                expand("expand-all")
                setTimeout(() => navigate("/channels/@me", { state: { accessToken } }), 300)
            })
            .catch(err => {
                expand("")
                setError(err.toString())
            })

    }

    return (
        <div className={`login ${animation}`}>
            <h2 className="login-text">Login To Continue</h2>
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