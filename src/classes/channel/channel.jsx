import Hashtag from "../../icons/hashtag";

const ChannelJSX = ({ isClicked, onClick, channel }) => {
    return (
        <div onClick={onClick} className={`channel ${isClicked ? "c-clicked" : ""}`}>
            <Hashtag size={25} />
            <span>{channel.name}</span>
        </div>
    )
}

export default ChannelJSX