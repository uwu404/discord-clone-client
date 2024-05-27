import { Suspense, lazy, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { link } from "../../config.json"
import "./loadingScreen.css"
import ReactIcon from "../../assets/react"
const Message = lazy(() => import("../message"))

const LoadingScreen = ({ text }) => {
    return (
        <div className="loading-screen">
            <div>
                <div className="spinner">
                    <ReactIcon />
                </div>
                <div className="loading-text">
                    <span>{text}</span>
                </div>
            </div>
        </div>
    )
}

const Render = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)

    useEffect(() => {
        const controller = new AbortController()
        const token = location.state?.accessToken || localStorage.getItem("token")
        if (token) localStorage.setItem("token", token)

        if (!token) navigate("/login")
        else fetch(`${link}user`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            },
            signal: controller.signal
        })
            .then(res => res.json())
            .catch(console.log)
            .then(user => {
                setUser({ ...user, token })
            })

        return () => controller.abort()
    }, [location.state?.accessToken, navigate])

    return (
        <div>
            {user ? <Suspense fallback={<LoadingScreen />}><Message me={user} /></Suspense> : <LoadingScreen />}
        </div>
    )
}

export default Render