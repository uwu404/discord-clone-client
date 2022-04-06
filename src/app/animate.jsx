import { useState, useContext } from "react"
import Utils from "../utils"
import { ScreenContext } from "./message"

const Animate = (props) => {
    const [animation, setAnimation] = useState(props.type === 1 ? "taller" : "bigger")
    const { setView } = useContext(ScreenContext)
    const click = () => {
        setAnimation(props.type === 1 ? "shorter" : "smaller")
        setTimeout(() => setView(), 100)
        props.quit?.()
    }
    return (
        <div className={`${!props.normal ? "dark-div" : "clear-div"} ${animation}`}>
            <Utils.Out click={click}>
                {props.children}
            </Utils.Out>
        </div>
    )
}

export default Animate