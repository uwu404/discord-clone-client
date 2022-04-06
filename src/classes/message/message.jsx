import Utils from "../../utils";
import Invite from "./invite";
import Dots from "../../icons/3dots";
import Menu from "./menu";
import { useContext, useEffect, useRef, useState } from "react";
import Attachment from "./attachment";
import Input from "../../global/input";
import "./message.css"
import UserJSX from "../user/user";
import { ScreenContext } from "../../app/message";
import PreviousQueries from "../../cache";
import User from "../user";

const Text = ({ message, isBeingEdited, edit, input, setIsBeingEdited, edited }) => {
    if (isBeingEdited) return (
        <div className="message-editor">
            <div style={{ overflowY: "auto", maxHeight: "40vh" }} className="text-content">
                <Input defaultValue={message.content} onKeyDown={(k) => k.code === "Enter" && edit(k)} innerRef={input} className="message-edit not-input" />
            </div>
            <div className="editor-text">escape to <span onClick={() => setIsBeingEdited(false)}>cancel</span> or enter to <span onClick={edit}>save</span> </div>
        </div>
    )
    return <span className={`text ${(message.unsent ? "unsent-message " : " ") + (message.failed ? "failed-tosend" : "")}`}>{message.content}{edited && <span title={new Date(message.updatedAt).toDateString()} className="edited">(edited)</span>}</span>
}

const MessageJSX = ({ message, full }) => {
    const [clicked, setClicked] = useState(false)
    const [isBeingEdited, setIsBeingEdited] = useState(null)
    const { setView } = useContext(ScreenContext)
    const author = PreviousQueries.userCache.has(message.author.id) ? new User(PreviousQueries.userCache.get(message.author.id)) : message.author
    const input = useRef()
    const clickOut = (...args) => {
        setClicked(false)
        setView(...args)
    }
    const click = async (e) => {
        if (clicked) return clickOut()
        setClicked(true)
        const viewportOffset = e.target.getBoundingClientRect()
        const style = {
            left: viewportOffset.left + viewportOffset.width + 7 < window.innerWidth - 275 ? viewportOffset.left + viewportOffset.width + 7 : window.innerWidth - 275,
            top: viewportOffset.top - 60
        }
        setView(
            <Utils.Out getEvent={true} click={e => e.target.id !== `avatar-${message.id}` && clickOut()}>
                <UserJSX setView={clickOut} user={message.author} server={message.server} style={style} />
            </Utils.Out>
        )
    }
    const join = (server) => message.onJoin(server)
    const triggerEdit = (ifEmptyDelete) => {
        document.dispatchEvent(new KeyboardEvent("keydown", { code: "Escape" }))
        setIsBeingEdited(() => ifEmptyDelete)
    }
    const menu = (e) => {
        const viewportOffset = e.target.getBoundingClientRect();
        const style = {
            top: viewportOffset.top,
            left: viewportOffset.left,
            zIndex: 4
        }
        const out = () => {
            setView()
            setClicked(false)
        }
        setView(<Menu clickOut={out} edit={triggerEdit} style={style} message={message} />)
        setClicked(true)
    }
    const edit = (e) => {
        if (!input.current?.innerText.trim()) {
            e.preventDefault()
            return isBeingEdited()
        }
        if (input.current) message.edit(input.current.innerText)
        setIsBeingEdited()
    }

    const edited = new Date(message.updatedAt).getTime() !== new Date(message.timestamp).getTime()

    useEffect(() => {
        const listener = (e) => {
            if (e.code === "Escape") setIsBeingEdited(null)
        }
        document.addEventListener("keydown", listener)
        return () => document.removeEventListener("keydown", listener)
    }, [message.author])

    return (
        <div id={message.id} className={`message-div ${message.unsent ? "unsent" : ""} ${(clicked || !!isBeingEdited) && "clicked"}`} style={{ marginTop: full ? "0.4em" : 0 }}>
            {full ? <img id={`avatar-${message.id}`} onClick={click} width="40" height="40" className="author-icon" src={author.displayAvatarURL(90)} alt="avatar" /> :
                <span className="timestamp">{`${message.timestamp.getHours()}`.padStart(2, '0')}:{`${message.timestamp.getMinutes()}`.padStart(2, '0')}</span>}
            <div className="message-content">
                {full && <span className="author-name"><span onClick={click} className="exact-author">{author.username}</span><span className="exact-time">{message.createdAt}</span></span>}
                <Text input={input} isBeingEdited={isBeingEdited} setIsBeingEdited={setIsBeingEdited} edited={edited} edit={edit} message={message} />
                <Attachment message={message} />
                {message.invite?._id && <Invite me={message.me} onJoin={join} invite={message.invite} code={message.inviteCode} />}
                <div onClick={menu} tabIndex="0" className="message-params"><Dots size={22} /></div>
            </div>
        </div>
    )
}

export default MessageJSX