import { useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { UserContext } from "../../app/message"

const ServerJSX = ({ server }) => {
    const navigate = useNavigate()
    const params = useParams()
    const { user } = useContext(UserContext)
    const clicked = params.server === server.id

    const handleKeyDown = e => {
        if (e.code === "Enter") {
            e.preventDefault()
            e.stopPropagation()
            e.target.click()
        }
    }

    return (
        <div className={`server-block ${clicked && "clicked"}`}>
            <div onKeyDown={handleKeyDown} onClick={() => navigate(`/channels/${server.id}`, { state: { user } })} title={server.name} tabIndex="0" role="button" className="server">
                {server.icon ?
                    <img width="48" height="48" alt="icon" src={server.displayIcon(100)} className="server-icon" /> :
                    <div style={{ width: 48, height: 48 }} className="server-icon default-no-img-div">{server.name[0]}</div>
                }
            </div>
            <div className="server-marker" />
        </div>
    )
}

export default ServerJSX