import React, { useEffect, useRef } from "react"

const OutSideListener = ({ onClick, children, getEvent, animation = "" }) => {
    const childrenRef = useRef([])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (childrenRef.current && !childrenRef.current.some(ref => ref.contains(event.target))) {
                onClick?.(event)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [onClick, getEvent])

    const clones = React.Children.map(children, (child, index) => React.cloneElement(child, {
        ref: (ref) => (childrenRef.current[index] = ref),
        className: `${child.props.className} ${animation}`
    }))

    return clones
}

export default OutSideListener