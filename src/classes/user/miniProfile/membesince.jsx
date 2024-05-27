const MemberSince = ({ user, display }) => {
    const date = new Date(user.createdAt)

    if (!display) return null
    return (
        <div>
            <h5 className="about-her">MEMBER SINCE</h5>
            <div style={{ userSelect: "none" }} className=" about-you">{date.toDateString()}</div>
        </div>
    )
}

export default MemberSince