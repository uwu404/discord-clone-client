import "./statusList.css"

const StatusList = ({ position }) => {
    return (
        <div style={position} className="annihilator">
            <ul className="status-list">
                <li>
                    <div className="your-opinion">
                        <span>Online</span>
                    </div>
                </li>
                <li>
                    <div className="your-opinion">
                        <span>Do Not Disturb</span>
                    </div>
                </li>
                <li>
                    <div className="your-opinion">
                        <span>Idle</span>
                    </div>
                </li>
                <li>
                    <div className="your-opinion">
                        <span>Invisible</span>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default StatusList