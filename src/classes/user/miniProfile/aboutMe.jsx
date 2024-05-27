import "./aboutme.css"

const AboutMe = ({ content }) => {
    if (!content) return null
    return (
        <div className="about-him">
            <h5 className="about-her">ABOUT ME</h5>
            <span className="about-you">{content}</span>
        </div>
    )
}

export default AboutMe