import { useState, useRef } from "react"
import "./index.css"
import { link } from "../../config.json"
import { useNavigate } from "react-router-dom"

function Signup() {
    const [animation, shrink] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const username = useRef()
    const password = useRef()
    const email = useRef()
    const confirmPassword = useRef()
    const login = () => {
        shrink("shrink-me")
        setTimeout(() => navigate("/login"), 200)
    }
    const createAccount = (e) => {
        e.preventDefault()
        const dataPassword = password.current.value
        const dataEmail = email.current.value
        if (password.current.value !== confirmPassword.current.value) return setError("Passwords don't match")
        shrink("waiting")
        fetch(`${link}createuser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username.current.value,
                email: dataEmail,
                password: dataPassword
            })
        })
            .then(res => res.json())
            .catch(err => {
                console.log(err)
                shrink("")
                setError("Error")
            })
            .then(async result => {
                if (result.error) return setError(result.error)
                const user = await fetch(`${link}user?password=${dataPassword}&email=${dataEmail}`).then(res => res.json())
                navigate("/channels/@me", { state: { user } })
            })
    }

    return (
        <div className={`login signup ${animation}`}>
            <h2 className="login-text signup-text">Create An Account</h2>
            <form name="sign-up">
                <input autoComplete="off" ref={username} className="login-input username" placeholder="Username" />
                <input autoComplete="email" ref={email} className="login-input signup-email" placeholder="Email" />
                <input autoComplete="off" ref={password} className="login-input signup-password" type="password" placeholder="Password" />
                <input autoComplete="off" type="password" ref={confirmPassword} className="login-input confirm" placeholder="Confirm password" />
                <p className="no-account">Already have an account? <span onClick={login}>login</span></p>
                <button onClick={createAccount} className="button-login sign-up">Create an account</button>
            </form>
            <p className="error-message">{error}</p>
        </div>
    )
}

export default Signup