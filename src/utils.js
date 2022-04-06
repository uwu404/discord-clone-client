import React, { useRef, useEffect } from "react";

function useOutsideAlerter(ref, e, getEvent) {
    useEffect(() => {

        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                if (getEvent) return e(event)
                e?.()
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, e, getEvent]);
}

const Utils = {
    Out({ click, children, getEvent}) {
        const wrapperRef = useRef(null);
        useOutsideAlerter(wrapperRef, click, getEvent);
        return <div className="outer-div" ref={wrapperRef}>{children}</div>;
    },
    isScolled(el, holder) {
        holder = holder || document.body
        const { top, bottom, height } = el.getBoundingClientRect()
        const holderRect = holder.getBoundingClientRect()

        return top <= holderRect.top
            ? holderRect.top - top <= height
            : bottom - holderRect.bottom <= height
    }
}

export default Utils