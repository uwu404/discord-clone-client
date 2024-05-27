import { useState, useContext, useEffect, useCallback } from "react"
import { AppContext } from "../app/message"
import OutSideListener from "./outSideListener"

const Animate = (props) => {
    const [animation, setAnimation] = useState(props.type === 1 ? "taller" : "bigger")
    const { setLayer } = useContext(AppContext)

    const click = useCallback((e) => {
        setAnimation(props.type === 1 ? "shorter" : "smaller")
        setTimeout(() => setLayer(), 100)
        props.quit?.(e)
    }, [setLayer, props])

    useEffect(() => {
        setTimeout(() => {
            if (Array.isArray(props.element?.current)) props.element.current.forEach(el => el?.addEventListener('click', click))
            else props.element?.current?.addEventListener('click', click)
        }, 200)
    }, [props.element, click])

    return (
        <div className={`${!props.normal ? "dark-div" : "clear-div"}`}>
            <OutSideListener animation={animation} getEvent onClick={click}>
                {props.children}
            </OutSideListener>
        </div>
    )
}

export default Animate