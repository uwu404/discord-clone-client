import { link } from "../../../config.json"
import "./activities.css"

const Activities = () => {
    return (
        <div className="activities">
            <div className="active-now">
                <h2 className="active-now-header">Active Now (N/A)</h2>
            </div>
            <div style={{ backgroundImage: `url("${link}construction.svg")` }} className="construction"></div>
        </div>
    )
}

export default Activities