import React, { useRef, useEffect } from "react"

const useOutsideAlerter = (refs, e, getEvent) => {
    useEffect(() => {

        const handleClickOutside = (event) => {
            if (refs.current && refs.current.some(ref =>  !ref.contains(event.target))) {
                if (getEvent) return e(event)
                e?.()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [refs, e, getEvent])
}

const Utils = {
    Out({ click, children, getEvent }) {
        const childrenRef = useRef([])
        useOutsideAlerter(childrenRef, click, getEvent)
        
        const clones = React.Children.map(children, (child, index) => React.cloneElement(child, {
            ref: (ref) => (childrenRef.current[index] = ref)
        }))

        return clones
    },
    isScrolled(el, holder) {
        holder = holder || document.body
        const { top, bottom, height } = el.getBoundingClientRect()
        const holderRect = holder.getBoundingClientRect()

        return top <= holderRect.top
            ? holderRect.top - top <= height
            : bottom - holderRect.bottom <= height
    }
}

export default Utils