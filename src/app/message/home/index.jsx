import { useEffect, useState, useContext, useMemo } from "react"
import User from "../../../classes/user"
import "./home.css"
import { AppContext, UserContext } from ".."
import Footer from "../../../classes/user/me/footer"
import SearchUsers from "./findConversation"
import PreviousQueries from "../../../cache"
import { Status } from "../../../global/avatar"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import At from "../../../assets/at"
import DM from "./directMessage"
import Friends from "./friends"
import Add from "./add"
import Pending from "./pending"
import Activities from "./activities"
import UserProfile from "./userProfile"
import DmUser from "./user"

const Render = ({ elemendId }) => {
    switch (elemendId) {
        case "online": return <Friends online />
        case "all": return <Friends />
        case "add": return <Add />
        case "pending": return <Pending />
        default: return null
    }
}

const Home = () => {
    const { user } = useContext(UserContext)
    const { setLayer } = useContext(AppContext)
    const [button, setButton] = useState("online")
    const params = useParams()
    const location = useLocation()
    const [logs, setLogs] = useState(PreviousQueries.logs.length ? PreviousQueries.logs : user.logs)
    const dm = logs.find(u => u._id === params.channel) || location.state?.dm?.user
    const Dm = useMemo(() => dm && new User(dm), [dm])
    const navigate = useNavigate()

    useEffect(() => {
        PreviousQueries.setLogs(logs)
    }, [logs])

    useEffect(() => {
        if (!Dm) return
        if (!logs.some(u => u._id === Dm.id) && !PreviousQueries.logs.some(u => u._id === Dm.id)) {
            setLogs(prev => [Dm, ...prev])
        }
    }, [Dm, user, logs])

    const click = (button) => () => setButton(button)

    const getFriends = () => navigate("/channels/@me", { state: { user } })

    const makeConversation = () => setLayer(<SearchUsers logs={logs} />)

    return (
        <main className="flexible-container">
            <section className="left-part">
                <header className="server-name home-search">
                    <input onClick={makeConversation} value="Find or start a conversation" className="home-search-input generic-input-type-button" type="button" />
                </header>
                <div className="channels">
                    <div onClick={getFriends} className={`friends-click ${!Dm && "friends-clicked"}`}>
                        <span>Friends</span>
                    </div>
                    <h4 className="direct-messages">DIRECT MESSAGES</h4>
                    {logs.map(u => <DmUser key={u._id} user={u} />)}
                </div>
                <Footer />
            </section>
            <section className={`messages messages-home ${!dm && "has-activity-list"}`}>
                <div className={`name name-${button}`}>
                    {!Dm ? <div className="flexing">
                        <h3 className="h3-title">Friends <span>|</span></h3>
                        <div className="home-buttons">
                            <button onClick={click("online")} className="online">Online</button>
                            <button onClick={click("all")} className="all">All</button>
                            <button onClick={click("pending")} className="pending">Pending</button>
                            <button onClick={click("add")} className="add-friend">Add friend</button>
                        </div>
                    </div> :
                        <div className="dm-title">
                            <div className="channel-title">
                                <At size={25} />
                                <span>{Dm.username}</span>
                                <svg height={24} width={24}>
                                    <Status size={24} status={"online"} />
                                </svg>
                            </div>
                        </div>
                    }</div>
                <div className="messages-main">
                    <Render elemendId={!dm ? button : null} />
                    {dm ? <DM setLogs={setLogs} dmUser={Dm} /> : null}
                </div>
                <aside className="profile-user">
                    <div className="the-users">
                        {dm ? <UserProfile user={Dm} /> : <Activities />}
                    </div>
                </aside>
            </section>
        </main>
    )
}

export default Home