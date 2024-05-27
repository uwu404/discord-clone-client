import { useContext, useEffect, useState } from "react"
import handleSocketEvents from "./app/message/handleSocketEvents"
import { UserContext } from "./app/message/index"

const userCache = new Map()

const cacheUserFromMessages = (messages) => {
    for (const message of messages) {
        if (!userCache.has(message.author._id)) userCache.set(message.author._id, message.author)
    }
}

// this will not only cache http requests but also get users from it
const cacheUserFromMembers = (members) => {
    for (const member of members) {
        if (!userCache.has(member._id)) userCache.set(member._id, member)
    }
}

const cacheUser = (items, type) => {
    if (type === "channels") cacheUserFromMessages(items)
    if (type === "serverMembers" || type === "logs") cacheUserFromMembers(items)
}

const useCache = (userId) => {
    const { socket } = useContext(UserContext)
    const [user, setUser] = useState(userCache.get(userId))

    useEffect(() => {
        if (!user) return

        const handleStatusChange = u => {
            if (u.user !== userId) return
            setUser(prev => ({ ...prev, status: u.status }))
        }

        const handleMemberUpdate = u => {
            if (u._id !== userId) return
            setUser(prev => ({ ...prev, u }))
        }

        socket.on("statusChange", handleStatusChange)
        socket.on("memberUpdate", handleMemberUpdate)

        return () => {
            socket.off("statusChange", handleStatusChange)
        }
    }, [socket, user, userId])

    return user
}

export { useCache }

// making this a custom hook that uses state will make the app render way too many times
const PreviousQueries = {
    channels: {},
    serverMembers: {},
    logs: [],
    setLogs(fn) {
        if (typeof fn === "function") {
            cacheUser(fn(PreviousQueries.logs || []), "serverMembers")
            return PreviousQueries.logs = fn(PreviousQueries.logs || [])
        }
        cacheUser(fn, "serverMembers")
        PreviousQueries.logs = fn
    },
    at(type, key) {
        return (fct) => {
            const channelsIds = Object.keys(this.channels)
            if (channelsIds.length > 9) {
                delete this.channels[channelsIds[Math.floor(Math.random() * channelsIds.length)]]
            }
            if (typeof fct === "function") {
                cacheUser(fct(this[type][key] || []), type)
                return this[type][key] = [...(new Set(fct(this[type][key] || [])))]
            }
            cacheUser(fct, type)
            this[type][key] = fct
        }
    },
    init(socket) {
        // update http requests through websocket
        const messageEvent = msg => {
            const setMessages = PreviousQueries.at("channels", msg.channel)
            handleSocketEvents.message(setMessages, msg)
        }
        const messageDeleteEvent = msg => {
            const setMessages = PreviousQueries.at("channels", msg.channel)
            setMessages(prev => prev.filter(m => m._id !== msg._id))
        }
        const messageEditEvent = msg => {
            const setMessages = PreviousQueries.at("channels", msg.channel)
            handleSocketEvents.messageEdit(setMessages, msg)
        }
        const DMEvent = msg => {
            const setMessages = PreviousQueries.at("channels", msg.channel)
            setMessages(prev => [...prev, msg])
        }
        const memberUpdateEvent = member => {
            if (!userCache.has(member._id)) return
            const user = userCache.get(member._id)
            userCache.set(member._id, Object.assign(user, member))
        }
        const statusEvent = member => {
            if (!userCache.has(member.user)) return
            const user = userCache.get(member.user)
            user.status = member.status
        }
        const memberJoin = (server, member) => {
            if (!this.serverMembers[server._id]) return
            this.serverMembers[server._id].push(member)
        }
        const memberLeave = (server, member) => {
            if (!this.serverMembers[server._id]) return
            const indexOfMember = this.serverMembers[server._id].findIndex(m => m._id === member._id)
            this.serverMembers[server._id].splice(indexOfMember, 1)
        }
        const clear = () => this.clear()
        socket.on("message", messageEvent)
        socket.on("messageDelete", messageDeleteEvent)
        socket.on("dm", DMEvent)
        socket.on("messageEdit", messageEditEvent)
        socket.on("memberUpdate", memberUpdateEvent)
        socket.on("statusChange", statusEvent)
        socket.on("memberJoin", memberJoin)
        socket.on("memberLeave", memberLeave)
        socket.on("disconnect", clear)
        return () => {
            socket.off("message", messageEvent)
                .off("messageDelete", messageDeleteEvent)
                .off("dm", DMEvent)
                .off("messageEdit", messageEditEvent)
                .off("memberUpdate", memberUpdateEvent)
                .off("online", statusEvent)
                .off("disconnect", clear)
                .off("memberJoin", memberJoin)
                .off("memberLeave", memberLeave)
        }
    },
    clear() {
        this.channels = {}
        this.logs = []
        this.serverMembers = {}
    },
    userCache
}

export default PreviousQueries