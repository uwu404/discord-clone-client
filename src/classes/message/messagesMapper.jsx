import React from "react"
import Message from "."
import MessageJSX from "./message"

const Messages = ({ messages, setMessages, me, onJoin, server }) => {
    const jsx = messages.map((message, i) => {
        const mapped = new Message(Object.assign(message, { setMessages }), me, onJoin, server)
        const full = mapped.author.id === messages[i - 1]?.author._id
        const $ = mapped.timestamp.toDateString() !== new Message(messages[i - 1] || mapped).timestamp.toDateString()
        return (
            <React.Fragment key={mapped.id}>
                {$ && !!i && <div className="new-day"><div /><span>{mapped.timestamp.toDateString()}</span><div /></div>}
                <li>
                    <MessageJSX full={!full || $} message={mapped} />
                </li>
            </React.Fragment>
        )
    })
    return jsx
}

export default Messages