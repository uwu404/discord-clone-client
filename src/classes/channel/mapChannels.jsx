import { useEffect, useState } from "react"
import Channel from "."
import ChannelJSX from "./channel"

const move = (array, from, to) => from < to
    ? [...array.slice(0, from), ...array.slice(from + 1, to), array[from], ...array.slice(to)]
    : [...array.slice(0, to), array[from], ...array.slice(to, from), ...array.slice(from + 1)]

const MapChannels = ({ channels: items, server }) => {
    const [channels, setChannels] = useState(items)

    useEffect(() => {
        setChannels(items)
    }, [items])

    const [dragItem, setDragItem] = useState(null)
    const [dragOverItem, setDragOverItem] = useState(null)

    const handleDragEnter = (_, index) => setDragOverItem(index)

    const handleDragStart = (_, index) => setDragItem(index)

    const handleDragEnd = () => {
        if (dragItem === null || dragOverItem === null) return
        setChannels(prev => move(prev, dragItem, dragOverItem + 1))
        setDragItem(null)
        setDragOverItem(null)
    }

    return (
        <>
            <div onDragEnter={() => setDragOverItem(-1)} style={{ height: 10, width: "100%", position: "relative" }}>
                <div className={`green-thing ${dragOverItem === -1 ? "highlight" : ""}`}></div>
            </div>
            {channels.map((c, i) => {
                const channel = new Channel(c, server)
                return (
                    <li onDragEnd={handleDragEnd} onDragStart={e => handleDragStart(e, i)} onDragEnter={e => handleDragEnter(e, i)} draggable className="channel-item" key={i}>
                        <ChannelJSX channel={channel} />
                        <div className={`green-thing ${i === dragOverItem ? "highlight" : ""}`}></div>
                    </li>
                )
            })}
        </>
    )
}

export default MapChannels