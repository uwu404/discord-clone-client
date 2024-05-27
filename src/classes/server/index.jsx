import "./index.css"
import { link } from "../../config.json"
import PreviousQueries from "../../cache"

class Server {
    constructor(server, user) {
        for (const key in server) {
            this[key] = server[key]
        }
        this.id = server._id
    }
    displayIcon(width, height) {
        if (!this.icon) return `${link}images/default`
        return `${link + this.icon}?${width ? `width=${width}&height=${height || width}` : ""}`
    }
    async fetchMembers(token) {
        if (PreviousQueries.serverMembers[this.id]) return PreviousQueries.serverMembers[this.id]
        const members = await fetch(`${link}servers/${this.id}/members`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .catch(() => [])
        const setMembers = PreviousQueries.at("serverMembers", this.id)
        setMembers(members)
        return members
    }
}

export default Server