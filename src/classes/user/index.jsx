import "./index.css"
import { useContext, useLayoutEffect, useRef, useState } from 'react'
import Utils from "../../utils"
import { link } from "../../config.json"
import UserSettings from "./user-settings"
import Gear from "../../icons/settings"
import { ScreenContext, socket } from "../../app/message"
import Home from "../../app/message/home"
import { Update } from "../../app"

const Icon = (user) => {
    const { setUser } = useContext(ScreenContext)
    const me = new User(user)
    const editHandler = (u) => {
        setUser(u)
        appear()
    }
    const save = () => {
        user.view(<UserSettings onEdit={editHandler} user={me} name="bigger waiting" onClickOut={disappear} />)
    }
    const appear = () => user.view(<UserSettings onEdit={editHandler} user={me} name="bigger" onClickOut={disappear} onSave={save} />)
    const disappear = () => {
        user.view(<UserSettings onEdit={editHandler} user={me} name="smaller" onClickOut={disappear} />)
        setTimeout(() => user.view(), 100)
    }
    return (
        <footer className="footer">
            <img className="my-pfp" src={me.displayAvatarURL(80)} alt="icon" />
            <h5 className="my-username">{me.username}<span>{me.tag}</span></h5>
            <div onClick={appear} className="settings-button"><Gear width={20} height={20} /></div>
        </footer>
    )
}

export const usersCache = {}

class User {
    constructor(user) {
        this.username = user.username
        this.avatarURL = user.avatarURL
        this.id = user._id
        this._id = user._id
        this.token = user.token
        this.tag = user.tag
        this.view = user.view
        this.servers = user.servers
        this.update = user.update
        this.password = user.password
        this.email = user.email
        this.online = user.online
    }
    static MapMembers({ members, server, setView, me }) {
        const onlineLength = members.filter(m => m?.online).length, offlineLength = members.length - onlineLength
        const online = [<h5 className="members-title" key="online">ONLINE — {onlineLength}</h5>],
            offline = [<h5 className="members-title" key="offline">OFFLINE — {offlineLength}</h5>]
        const sortedMembers = members.sort((a, b) => a.username.localeCompare(b.username))
        for (const member of sortedMembers) {
            const Member = new User(Object.assign(member, { view: setView }))
            const jsx = Member.toMember(server, me)
            if (member.online) online.push(jsx)
            else offline.push(jsx)
        }
        if (offline.length === 1) offline.length = 0
        if (online.length === 1) online.length = 0
        return online.concat(offline)
    }
    displayAvatarURL(size) {
        return `${link + this.avatarURL}?${size ? `width=${size}&height=${size}` : ""}`
    }
    toIcon() {
        return Icon(this)
    }
    toJSX(style, server, me, setUser) {
        const user = usersCache[this.id] ? new User(usersCache[this.id]) : this
        const Component = () => {
            const { setScreen, setServer } = useContext(ScreenContext)
            const update = useContext(Update)
            const [online, setOnline] = useState(user.online)
            const [top, setTop] = useState(style.top)
            const divRef = useRef()
            useLayoutEffect(() => {
                let isMounted = true
                setUser?.(user)
                socket.on("online", id => {
                    if (isMounted && this.id === id) setOnline(true)
                })
                socket.on("offline", id => {
                    if (isMounted && this.id === id) setOnline(false)
                })
                const viewportOffset = divRef.current.getBoundingClientRect();
                if (style.top > window.innerHeight - viewportOffset.height - 20) setTop(window.innerHeight - viewportOffset.height - 20)
                return () => { isMounted = false }
            }, [])

            const dm = (e) => {
                if (e.code !== "Enter") return
                setServer()
                setScreen(<Home update={update} dm={this} user={me} />)
            }
            const saveNote = (e) => localStorage.setItem(this.id, e.target.value)

            return (
                <div ref={divRef} style={{ ...style, top }} className={`user-div ${!online && "not-online"}`}>
                    <img width="88" height="88" src={user.displayAvatarURL(90)} alt="avatar" className="user-avatar" />
                    <h5 className="user-username">{user.username}<span>{user.tag}</span></h5>
                    <div className="line first"></div>
                    {server &&
                        <div className="roles">
                            <h5>ROLES</h5>
                            <div className="role">Member</div>
                            {server.owner === this.id && <div className="role">Owner</div>}
                            <div className="line last"></div>
                        </div>
                    }
                    <div className="note">
                        <h5>NOTE</h5>
                        <textarea onChange={saveNote} defaultValue={localStorage.getItem(this.id)} placeholder="Click to add a note"></textarea>
                    </div>
                    {me._id !== this.id && <input onKeyDown={dm} placeholder={`Message ${user.username}${user.tag}`} className="dm-user" />}
                </div>
            )
        }
        return <Component />
    }
    toMember(server, me) {
        const Member = () => {
            const [isClicked, setIsClicked] = useState(false)
            const [user, setUser] = useState(this)
            const showUser = (e) => {
                setIsClicked(true)
                const cancel = () => {
                    setIsClicked(false)
                    this.view()
                }
                const top = e.target.getBoundingClientRect().top - 40
                this.view(
                    <Utils.Out click={cancel}>
                        {user.toJSX({ right: 255, top, animationName: "reverseShift" }, server, me, setUser)}
                    </Utils.Out>
                )
            }
            return (
                <div onClick={showUser} key={this.id} className={`member ${isClicked && "member-clicked"} ${!this.online && "member-offline"}`}>
                    <img width="38" height="38" src={user.displayAvatarURL(90)} alt="avatar" className={`member-icon`} />
                    <div className="nice-div">
                        <h4 className={`member-name ${server?.owner === this.id && "owner"}`}>{user.username}</h4>
                        <p className="is-online">{this.online ? "Online" : "Offline"}</p>
                    </div>
                </div>
            )
        }
        return Member()
    }
    async fetch() {
        const response = await fetch(`${link}fetch/${this.id}`).then(res => res.json())
        this.avatarURL = response.avatarURL
        this.username = response.username
        return new User(Object.assign({ _id: this.id }, response))
    }
    async edit(username, data) {
        const edit = await fetch(`${link}user/edit`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: this.token
            },
            body: JSON.stringify({ username, data })
        }).then(res => res.json())
            .catch(console.log)

        this.avatarURL = edit.avatarURL
        this.username = edit.username
        return edit
    }
}

export default User