import { socket } from "./app/message"
import handleSocketEvents from "./app/message/handleSocketEvents"

const userCache = new Map()

const cacheUserFromMessages = (messages) => {
    for (const message of messages) {
        if (!userCache.has(message.author._id)) userCache.set(message.author._id, message.author)
    }
}

const cacheUserFromMembers = (members) => {
    for (const member of members) {
        if (!userCache.has(member._id)) userCache.set(member._id, member)
    }
}

const cacheUser = (items, type) => {
    if (type === "channels") cacheUserFromMessages(items)
    if (type === "serverMembers" || type === "logs") cacheUserFromMembers(items)
}

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
    init() {
        const messageEvent = msg => {
            const setMessages = PreviousQueries.at("channels", msg.channel)
            handleSocketEvents.message(setMessages, msg)
        }
        const messageDeleteEvent = msg => {
            const channels = Object.keys(this.channels)
            const channel = channels.find(ch => {
                return this.channels[ch].some(m => m._id === msg._id)
            })
            if (channel) {
                const setMessages = PreviousQueries.at("channels", channel)
                handleSocketEvents.messageDelete(setMessages, msg)
            }
        }
        const messageEditEvent = msg => {
            const editMessage = (id) => {
                const setMessages = PreviousQueries.at("channels", id)
                handleSocketEvents.messageEdit(setMessages, msg)
            }
            const channels = Object.keys(this.channels)
            const channel = channels.find(ch => {
                return this.channels[ch].some(m => m._id === msg._id)
            })
            if (channel) editMessage(channel)
        }
        const DMEvent = msg => {
            const dms = Object.keys(this.channels)
            const user = msg.dmFor.find(name => dms.includes(name))
            const setMessages = PreviousQueries.at("channels", user)
            handleSocketEvents.message(setMessages, msg)
        }
        const memberUpdateEvent = member => {
            if (!userCache.has(member._id)) return
            const user = userCache.get(member._id)
            userCache.set(member._id, Object.assign(user, member))
        }
        const onlineEvent = member => {
            if (!userCache.has(member.user)) return
            const user = userCache.get(member.user)
            user.online = member.online
        }
        const clear = () => this.clear()
        socket.on("message", messageEvent)
        socket.on("messageDelete", messageDeleteEvent)
        socket.on("dm", DMEvent)
        socket.on("messageEdit", messageEditEvent)
        socket.on("memberUpdate", memberUpdateEvent)
        socket.on("online", onlineEvent)
        socket.on("disconnect", clear)
        return () => {
            socket.off("message", messageEvent)
                .off("messageDelete", messageDeleteEvent)
                .off("dm", DMEvent)
                .off("messageEdit", messageEditEvent)
                .off("memberUpdate", memberUpdateEvent)
                .off("online", onlineEvent)
                .off("disconnect", clear)
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