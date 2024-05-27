import "./roles.css"

const Roles = ({ user, server }) => {

    if (!server) return null
    return (
        <div className="roles">
            <h5>ROLES</h5>
            <div className="role">Member</div>
            {server.owner === user.id && <div className="role">Owner</div>}
        </div>
    )
}

export default Roles