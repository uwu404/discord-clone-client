import { useEffect, useState } from "react"
import endpoints from "../../../global/endpoints"

const VCconnectionsEndPoint = endpoints.getVCconnections()

const useConnections = (user, socket) => {
    const [connections, setConnections] = useState([])

    useEffect(() => {
        const handleUserJoining = (userJoining, channel) => {
            setConnections(prev => {
                const newArray = [...prev]
                if (!newArray.find(c => c._id === channel._id)) newArray.push({ ...channel, users: [] })
                return newArray.map(c => c._id === channel._id ? { ...c, users: [...c.users, userJoining] } : c)
            })
        }
        const handleUserLeaving = (userLeaving, channel) => {
            setConnections(prev => [...prev].map(c => c._id === channel._id ? { ...c, users: c.users.filter(u => u._id !== userLeaving._id) } : c))
        }
        const serverJoin = server => {
            setConnections(prev => [...prev, ...server.channels])
        }
        fetch(VCconnectionsEndPoint.endPoint, {
            method: VCconnectionsEndPoint.method,
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        })
            .then(res => res.json())
            .then(connections => {
                setConnections(connections)
                socket.on("joinvc", handleUserJoining)
                socket.on("leavevc", handleUserLeaving)
                socket.on("serverJoin", serverJoin)
            })
        return () => {
            socket.off("joinvc", handleUserJoining)
                .off("leavevc", handleUserLeaving)
                .off("serverJoin", serverJoin)
        }
    }, [user.token, socket])

    return connections
}

export default useConnections