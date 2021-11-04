import { useState, useRef } from "react"
import "./index.css"
import Login from "../login"
import { link } from "../../config.json"
import Message from "../message"

function Signup({ update }) {
    const [animation, shrink] = useState("")
    const [error, setError] = useState("")
    const username = useRef()
    const password = useRef()
    const email = useRef()
    const consfirmPassword = useRef()
    const login = () => {
        shrink("shrink-me")
        setTimeout(() => update(<Login update={update}/>), 200)
    }
    const createAccount = () => {
        console.log(username.current.value)
        fetch(`${link}createuser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username.current.value,
                email: email.current.value,
                password: password.current.value
            })
        })
        .then(res => res.json())
        .catch(err => {
            console.log(err)
            setError("Error")
        })
        .then(async result => {
            if (result.error) return setError(result.error)
            const user = await fetch(`${link}user?password=${result.password}&email=${result.email}`).then(res => res.json())
            sessionStorage.setItem("user", JSON.stringify(user))
            update(<Message user={user}/>)
        })
    }

    return (
        <div className={`login signup ${animation}`}>
            <h2 className="login-text signup-text">Create an account</h2>
            <input ref={username} className="login-input username" placeholder="Username"/>
            <input ref={email} className="login-input signup-email" placeholder="Email"/>
            <input ref={password} className="login-input signup-password" type="password" placeholder="Password"/>
            <input ref={consfirmPassword} className="login-input confirm" placeholder="Confirm password"/>
            <p className="no-account">Already have an account? <span onClick={login}>login</span></p>
            <button onClick={createAccount} className="button-login sign-up">Create an account</button>
            <p className="error-message">{error}</p>
        </div>
    )
}

export default Signup