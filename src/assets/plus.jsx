import React from "react"

const Plus = (props) => {
    return (
        <svg {...props} height={props.size} width={props.size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12H20M12 4V20" stroke="currentColor" strokeWidth={props.strokeWidth ?? "2"} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default Plus