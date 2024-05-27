const Status = ({ status, size }) => {
    const sizes = {
        24: { x: 8, w: 10, s: 2.5 },
        32: { x: 22, w: 10, s: 2.5 },
        80: { x: 60, w: 16, s: 4 },
        120: { x: 88, w: 24, s: 6 }
    }
    const x = sizes[size].x
    const w = sizes[size].w
    const s = sizes[size].s

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

export { Status }

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