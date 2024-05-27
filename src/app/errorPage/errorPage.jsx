import { Link } from "react-router-dom"

const Error = () => {
    return (
        <div className={`login`}>
            <h2 className="login-text">You Seem Lost...</h2>
            <Link to='/login'>Go to the login page</Link>
            <br /><br /><br />
        </div>
    )
}

export default Error