import { useContext, useEffect, useState } from "react"
import MapUsers from "./mapUsers"
import { link } from "../../../config.json"
import { UserContext } from ".."

const Friends = ({ online }) => {
    const { user } = useContext(UserContext)
    const [friends, setFriends] = useState([])

    useEffect(() => {
        let isMounted = true
        fetch(`${link}friends`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }).then(res => res.json())
            .then(friends => {
                if (isMounted) setFriends(online ? friends.filter(f => f.online) : friends)
            })
        return () => {
            isMounted = false
            setFriends([])
        }
    }, [user.token, online])

    return (
        <div>
            <input placeholder="Search" className="generic-input search-for-friends" />
            <h5 className="home-title">{online ? "ONLINE" : "ALL FRIENDS"}—{friends.length}</h5>
            <div className="list stylish-scrollbar">
                <MapUsers type="friends" users={friends} />
            </div>
        </div>
    )
}

export default Friends