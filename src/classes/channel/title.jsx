import Hashtag from "../../assets/hashtag"

const Title = ({ channel }) => {
    return (
        <div className="channel-title">
            <Hashtag size={25} />
            <span>{channel.name}</span>
        </div>
    )
}

export default Title