import { forwardRef, useState } from "react"

const CustomRangeInput = ({ onChange, ...props }, ref) => {
    const [gradient, setGradient] = useState((props.defaultValue - props.min) / (props.max - props.min) * 100)

    const handleChange = e => {
        const value = (e.target.value - e.target.min) / (e.target.max - e.target.min) * 100
        setGradient(value)
        onChange?.(e)
    }

    return <input ref={ref} style={{ background: `linear-gradient(to right, var(--blue) 0%, var(--blue) ${gradient}%, var(--font-background-secondary) ${gradient}%, var(--font-background-secondary) 100%)` }} onChange={handleChange} {...props} />
}

export default forwardRef(CustomRangeInput)