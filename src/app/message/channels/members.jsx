import { useContext, useEffect, useState } from "react"
import MapMembers from "../../../classes/server/members/mapMembers"
import MemberLoading from "../../../assets/members"
import { UserContext } from ".."

const Members = ({ server }) => {
    const { user, socket } = useContext(UserContext)
    const [members, setMembers] = useState([])

    useEffect(() => {
        let isMounted = true

        const statusEvent = user => {
            setMembers(members => members.map(u => u._id === user.user ? { ...u, status: user.status } : u))
        }

        const memberUpdateListener = user => {
            setMembers(prev => prev.map(u => u._id === user._id ? user : u))
        }

        const memberJoinListener = (s, member) => {
            if (s._id !== server.id) return
            setMembers(prev => [...prev, member])
        }

        const memberLeaveListener = (s, member) => {
            if (s._id !== server.id) return
            setMembers(prev => prev.filter(m => m._id !== member._id))
        }

        server.fetchMembers(user.token).then(members => {
            if (!isMounted) return
            setMembers(members)
            socket.on("statusChange", statusEvent)
            socket.on("memberUpdate", memberUpdateListener)
            socket.on("memberJoin", memberJoinListener)
            socket.on("memberLeave", memberLeaveListener)
        })

        return () => {
            setMembers([])
            socket.off("statusChange", statusEvent)
                .off("memberJoin", memberJoinListener)
                .off("memberLeave", memberLeaveListener)
                .off("memberUpdate", memberUpdateListener)
            isMounted = false
        }
    }, [server, user.token, socket])

    return (
        <div className={`users`}>
            {members.length === 0 &&
                <div style={{ marginTop: 20 }}>
                    <MemberLoading times={server.members.length ?? 10} />
                </div>
            }
            <div className="wrapper-xyz">
                <MapMembers members={members} server={server} />
            </div>
        </div>
    )
}

export default Members