const Status = ({ status, size }) => {
    const x = size < 60 ? 22 : (size < 100 ? 60 : 88)
    const w = size < 60 ? 10 : (size < 100 ? 16 : 24)
    const s = size < 60 ? 2.5 : (size < 100 ? 4 : 6)
    switch (status) {
        case "online": return (
            <rect
                width={w}
                height={w}
                x={x}
                y={x}
                fill="var(--green)"
                rx="200"
            ></rect>
        )
        default: return (
            <circle
                r={w / 2 - s / 2}
                cx={x + w / 2}
                cy={x + w / 2}
                strokeWidth={s}
                stroke="var(--font-secondary)"
                fill="transparent"
            >
            </circle>
        )
    }
}

const Avatar = ({ src, status, className, size, ...props }) => {
    const name = size < 60 ? 32 : (size < 100 ? 80 : 120)
    return (
        <svg {...props} height={size} width={size}>
            <foreignObject className={`user-av ${className}`} height={size} width={size} y="0" x="0" mask={`url(#mask-round-${name})`}>
                <img style={{ width: size, height: size }} className="avatar-icon" alt="avatar" src={src} />
            </foreignObject>
            <Status size={size} status={status} />
        </svg>
    )
}

export default Avatar