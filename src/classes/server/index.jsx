import "./index.css"
import { link } from "../../config.json"
import PreviousQueries from "../../cache"

class Server {
    constructor(server, user) {
        for (const key in server) {
            this[key] = server[key]
        }
        this.id = server._id
        this.me = user
    }
    static LoadServers({ servers, click, isHome, me, index }) {
        const jsx = servers.map((s, i) => {
            const server = new Server(s, me)
            return server.toJSX(index === i && !isHome, () => {
                click(server)
            })
        })
        return jsx.reverse()
    }
    displayIcon(width, height) {
        if (!this.icon) return `${link}images/default`
        return `${link + this.icon}?${width ? `width=${width}&height=${height || width}` : ""}`
    }
    toJSX(clicked, click) {
        return (
            <div key={this.id} className={`server-block ${clicked && "clicked"}`}>
                <div title={this.name} tabIndex="0" role="button" className="server">
                    {this.icon ?
                        <img width="48" height="48" onClick={click} alt="icon" src={this.displayIcon(100)} className="server-icon" /> :
                        <div onClick={click} style={{ width: 48, height: 48 }} className="server-icon default-no-img-div">{this.name[0]}</div>
                    }
                </div>
                <div className="server-marker" />
            </div>
        )
    }
    async fetchMembers() {
        if (PreviousQueries.serverMembers[this.id]) return PreviousQueries.serverMembers[this.id]
        const members = await fetch(`${link}servers/${this.id}/members`, {
            headers: { Authorization: this.me.token }
        })
            .then(res => res.json())
            .catch(() => [])
        const setMembers = PreviousQueries.at("serverMembers", this.id)
        setMembers(members)
        return members
    }
}

export default Server