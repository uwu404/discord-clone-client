import "./index.css"
import { link } from "../../config.json"

class User {
    constructor(user) {
        for (const key in user) {
            this[key] = user[key]
        }
        this.id = user._id
    }
    displayAvatarURL(size) {
        return `${link + this.avatarURL}${size ? `?width=${size}&height=${size}` : ""}`
    }
    async fetch() {
        const response = await fetch(`${link}fetch/${this.id}`).then(res => res.json())
        this.avatarURL = response.avatarURL
        this.username = response.username
        return new User(Object.assign({ _id: this.id }, response))
    }
}

export default User