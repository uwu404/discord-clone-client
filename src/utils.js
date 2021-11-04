import React, { useRef, useEffect } from "react";

function useOutsideAlerter(ref, e) {
    useEffect(() => {

        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                e()
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, e]);
}

const Utils = {
    Out({ click, children }) {
        const wrapperRef = useRef(null);
        useOutsideAlerter(wrapperRef, click);
        return <div ref={wrapperRef}>{children}</div>;
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