import { Fragment, memo } from "react"
import Message from "."
import MessageJSX from "./message"
import SkeletonLoadingMessage from "../../assets/bones"

const Messages = memo(({ messages }) => {
    if (!messages) return <SkeletonLoadingMessage />

    const jsx = messages.map((message, i) => {
        const mapped = new Message(message)
        const full = mapped.author.id === messages[i - 1]?.author._id
        const isAnotherDay = mapped.timestamp.toDateString() !== new Message(messages[i - 1] || message).timestamp.toDateString()
        return (
            <Fragment key={mapped.id}>
                {isAnotherDay && !!i && <div className="new-day"><div /><span>{mapped.timestamp.toDateString()}</span><div /></div>}
                <li>
                    <MessageJSX full={!full || isAnotherDay} message={mapped} />
                </li>
            </Fragment>
        )
    })
    return jsx
})

export default Messages