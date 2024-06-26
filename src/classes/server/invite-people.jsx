import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../app/message";
import Plus from "../../assets/plus";
import "./options.css"
import { link } from "../../config.json"
import User from "../user";
import Animate from "../../global/animate";

const InvitePeople = ({ server }) => {
    const [friends, setFriends] = useState()
    const [ids, setIds] = useState([])
    const [filter, setFilter] = useState("")
    const [copied, setCopied] = useState(false)
    const cancelButton = useRef()
    const { user: me } = useContext(UserContext)

    useEffect(() => {
        let isMounted = true
        fetch(`${link}friends`, {
            headers: {
                Authorization: `Bearer ${me.token}`
            }
        }).then(res => res.json())
            .then(friends => {
                if (isMounted) setFriends(friends)
            })
        return () => { isMounted = false }
    }, [me])

    const copy = () => navigator.clipboard.writeText("server/" + server.invites[0]).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 5000)
    })

    return (
        <Animate element={cancelButton} >
            <div className={`invite-people-div animated-popup`}>
                <div className="part-1">
                    <h3>INVITE PEOPLE TO {server.name.toUpperCase()}</h3>
                    <input onChange={(e) => setFilter(e.target.value)} placeholder="Search for friends" />
                    <div className="exit" ref={cancelButton}>
                        <Plus size={25} />
                    </div>
                </div>
                <div className="part-2">
                    {!friends && <p className="searching">SEARCHING FOR FRIENDS</p>}
                    {friends && !friends.some(u => u.username.toLowerCase().includes(filter.toLowerCase())) && <p className="searching">NO RESULTS WERE FOUND</p>}
                    {friends && friends.map(f => {
                        const user = new User(f)
                        const click = () => {
                            if (ids.includes(user.id)) return
                            setIds(prev => [...prev, user.id])
                            fetch(`${link}dm/${user.id}`, {
                                method: "POST",
                                headers: {
                                    Authorization: `Bearer ${me.token}`,
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    content: "server/" + server.invites[0]
                                })
                            })
                                .catch(console.error)
                        }
                        if (filter && !user.username.toLowerCase().includes(filter.toLowerCase())) return null
                        return (
                            <div key={user.id} className="invite-friend">
                                <img alt={user.id} width="34" height="34" src={user.displayAvatarURL(80)} />
                                <h5>{user.username}</h5>
                                <button className={`${ids.includes(user.id) && "invited"}`} onClick={click}>{ids.includes(user.id) ? "Sent" : "Invite"}</button>
                            </div>
                        )
                    })}
                </div>
                <div className="part-3">
                    <h4>OR, SEND A SERVER INVITE LINK TO A FRIEND</h4>
                    <div>
                        <button className={`${copied ? "copied" : "copy"}`} onClick={copy}>{copied ? "Copied" : "Copy"}</button>
                        <input readOnly={true} value={"server/" + server.invites[0]} />
                    </div>
                </div>
            </div>
        </Animate>
    )
}

export default InvitePeople