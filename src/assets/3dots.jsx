function Dots({ size }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24">
            <rect id="view-box" width="24" height="24" fill="currentColor" opacity="0" />
            <path id="Shape" d="M12,1.5A1.5,1.5,0,1,1,13.5,3,1.5,1.5,0,0,1,12,1.5Zm-6,0A1.5,1.5,0,1,1,7.5,3,1.5,1.5,0,0,1,6,1.5Zm-6,0A1.5,1.5,0,1,1,1.5,3,1.5,1.5,0,0,1,0,1.5Z" transform="translate(4.5 11)" fill="currentColor" />
        </svg>
    )
}

export default Dots