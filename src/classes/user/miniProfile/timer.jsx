import { useEffect, useState } from "react"
import Gear from "../../../assets/settings"

const Timer = ({ display }) => {
    const [seconds, setSeconds] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds(prev => ++prev)
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    if (!display) return null
    return (
        <div className="customizing-my-profile">
            <h5>CUSTOMIZING MY PROFILE</h5>
            <div className="flex-line">
                <div className="activity-icon">
                    <Gear height={40} width={40} />
                </div>
                <div className="activity-name">
                    <h5>User Profile</h5>
                    <span>{(~~(seconds / 60)).toFixed().padStart(2, "0")}:{(seconds - (~~(seconds / 60) * 60)).toFixed().padStart(2, "0")} elapsed</span>
                </div>
            </div>
        </div>
    )
}

export default Timer