const Masks = () => {
    return (
        <svg style={{ position: "absolute", zIndex: -1000 }}>
            <mask viewBox="0 0 1 1" maskContentUnits="objectBoundingBox" id="mask-round-80">
                <circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle><circle fill="black" cx="0.85" cy="0.85" r="0.175"></circle>
            </mask>
            <mask viewBox="0 0 1 1" maskContentUnits="objectBoundingBox" id="mask-round-32">
                <circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle><circle fill="black" cx="0.85" cy="0.85" r="0.250"></circle>
            </mask>
            <mask viewBox="0 0 1 1" maskContentUnits="objectBoundingBox" id="mask-round-120">
                <circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle><circle fill="black" cx="0.8333" cy="0.8333" r="0.1666666666"></circle>
            </mask>
        </svg>
    )
}

export default Masks