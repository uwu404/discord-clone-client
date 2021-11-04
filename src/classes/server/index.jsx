import "./index.css"
import { useState } from "react"
import Utils from "../../utils"
import { link } from "../../config.json"
import Plus from "../../icons/plus"
import { friendsCache } from "../../app/message/home"

const components = {
    Add: ({ view, onCreate, user }) => {
        const [clicked, setClicked] = useState("")
        const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });

        const Creator = () => {
            const defaultName = `${user.username}'s server`
            const [value, setValue] = useState(defaultName)
            const [image, setImage] = useState(``)
            const [animation, setAnimation] = useState("bigger")

            const handleChange = async (e) => {
                toBase64(e.target.files[0])
                    .then(data => setImage(data))
                    .catch(console.log)
            }

            const del = () => {
                setClicked("")
                setAnimation("smaller")
                setTimeout(() => view(), 100)
            }

            const createServer = async () => {
                const server = await fetch(`${link}servers`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: user.token,
                    },
                    body: JSON.stringify({
                        icon: image,
                        name: value
                    })
                }).then(res => res.json())
                del()
                onCreate?.(server)
            }

            return (
                <div className={`dark-div ${animation}`}>
                    <Utils.Out click={del}>
                        <div className={`creator ${animation}`}>
                            <div className="view-server">
                                <Plus onClick={del} size={25} />
                                <h2>Create a new Server</h2>
                                <p className="dummy-text">Create a new Server, customize it! Invite your friends to it. And have a good time.</p>
                                <div className="selector">
                                    <img className="my-icon" alt="" src={image} />
                                    <input onChange={handleChange} className="select-icon" type="file" />
                                </div>
                            </div>
                            <label htmlFor="server">SERVER NAME</label>
                            <input required name="server" defaultValue={defaultName} onChange={(event) => setValue(event.target.value)} className="select-server-name" />
                            <div className="create-server">
                                <button onClick={createServer} className="create-server-button">Create</button>
                                <button onClick={del} className="create-server-button cancel-creating">Back</button>
                            </div>
                        </div>
                    </Utils.Out>
                </div>
            )
        }

        const click = () => {
            setClicked("add-clicked")
            view(<Creator />)
        }

        return (
            <div onClick={click} className={`add-server-border ${clicked}`}><div className="add-server"><Plus size={25}/></div></div>
        )
    }
}

class Server {
    constructor(server, user) {
        this.id = server._id
        this.members = server.members
        this.name = server.name
        this.icon = server.icon
        this.channels = server.channels
        this.me = user
        this.owner = server.owner
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
    static Add = components.Add
    displayIcon(width, height) {
        return `${link + this.icon}?${width ? `width=${width}&height=${height || width}` : ""}`
    }
    toJSX(clicked, click) {
        return (
            <div tooltip={this.name} key={this.id} className={`server ${clicked ? "click" : ""}`}>
                <img width="50" height="50" onClick={click} alt="icon" src={this.displayIcon(50)} className="server-icon" />
            </div>
        )
    }
    getSearchInput() {
        return (
            <div className="search-input">
                <input placeholder="search"/>
            </div>
        )
    }
    async fetchMembers(cacheBehaviour) {
        if (friendsCache.get(this.id)) return friendsCache.get(this.id)
        const members = await fetch(`${link}servers/${this.id}/members`, {
            headers: { Authorization: this.me.token },
            cache: cacheBehaviour
        })
            .then(res => res.json())
            .catch(err => console.log(err))
        friendsCache.add(this.id, members)
        return members
    }
}

export default Server