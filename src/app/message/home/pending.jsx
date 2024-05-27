import { useContext, useEffect, useState } from "react"
import MapUsers from "./mapUsers"
import { UserContext } from ".."
import { link } from "../../../config.json"

const Pending = () => {
    const { user } = useContext(UserContext)
    const [requests, setRequests] = useState([])

    useEffect(() => {
        let isMounted = true
        fetch(`${link}friends/pending`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }).then(res => res.json())
            .then(requests => {
                if (isMounted) setRequests(requests)
            })
        return () => { isMounted = false }
    }, [user])

    const click = (invite) => {
        setRequests(prev => [...prev].filter(u => u._id !== invite.id))
        fetch(`${link}accept/${invite.id}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }

    return (
        <>
            <h5 className="home-title">PENDING—{requests.length}</h5>
            <div className="list stylish-scrollbar">
                <MapUsers type="requests" onClick={click} users={requests} />
            </div>
        </>
    )
}

export default Pending