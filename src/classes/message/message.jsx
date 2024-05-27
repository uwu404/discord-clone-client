import Invite from "./invite";
import Dots from "../../assets/3dots";
import Menu from "./menu";
import { useContext, useEffect, useRef, useState } from "react";
import Attachment from "./attachment";
import Input from "../../global/input";
import "./message.css"
import UserJSX from "../user/miniProfile/user";
import { AppContext, UserContext } from "../../app/message";
import OutSideListener from "../../global/outSideListener";
import { SettingsContext } from "../../app";

const Attachments = ({ message }) => {
    return message.attachments?.map((att, i) => <Attachment key={i} attachment={att} />)
}

const Text = ({ message, isBeingEdited, edit, input, setIsBeingEdited }) => {
    const formatter = new Intl.DateTimeFormat(undefined, { dateStyle: "full" })
    const updatedAt = formatter.format(new Date(message.updatedAt))

    if (isBeingEdited) return (
        <div className="message-editor">
            <div style={{ overflowY: "auto", maxHeight: "40vh" }} className="text-content">
                <Input renderId={message.id} defaultValue={message.content} onKeyDown={(k) => k.code === "Enter" && edit(k)} innerRef={input} className="message-edit not-input" />
            </div>
            <div className="editor-text">escape to <span onClick={() => setIsBeingEdited(false)}>cancel</span> or enter to <span onClick={edit}>save</span> </div>
        </div>
    )
    return (
        <span className={`text ${(message.unsent && "unsent-message ")} ${(message.failed && "failed-tosend")}`}>
            <span>{message.content}</span>
            {message.edited && <span title={updatedAt} className="edited">(edited)</span>}
        </span>
    )
}

const MessageJSX = ({ message, full, noClicking }) => {
    const [clicked, setClicked] = useState(false)
    const [isBeingEdited, setIsBeingEdited] = useState(null)
    const { user, server } = useContext(UserContext)
    const { setLayer } = useContext(AppContext)
    const { preferredSettings } = useContext(SettingsContext)
    const input = useRef()
    const clickOut = (...args) => {
        setClicked(false)
        setLayer(...args)
    }
    const click = async (ev) => {
        if (noClicking) return
        if (clicked) return clickOut()
        setClicked(true)
        const viewportOffset = ev.target.getBoundingClientRect()
        const style = {
            left: viewportOffset.left + viewportOffset.width + 7 < window.innerWidth - 275 ? viewportOffset.left + viewportOffset.width + 7 : window.innerWidth - 275,
            top: viewportOffset.top - 60
        }
        setLayer(
            <OutSideListener getEvent onClick={e => !ev.target.contains(e.target) && clickOut()}>
                <UserJSX setLayer={clickOut} user={message.author} server={server} style={style} />
            </OutSideListener>
        )
    }

    const triggerEdit = (ifEmptyDelete) => {
        document.dispatchEvent(new KeyboardEvent("keydown", { code: "Escape" }))
        // 2 years later i still don't get how i made this work
        setIsBeingEdited(() => ifEmptyDelete)
    }

    const menu = (e) => {
        const viewportOffset = e.target.getBoundingClientRect()
        const style = {
            top: viewportOffset.top,
            right: window.innerWidth - viewportOffset.left,
            zIndex: 4
        }
        const out = () => {
            setLayer()
            setClicked(false)
        }
        setLayer(<Menu clickOut={out} edit={triggerEdit} style={style} message={message} />)
        setClicked(true)
    }

    const edit = (e) => {
        if (!input.current?.innerText.trim()) {
            e.preventDefault()
            return isBeingEdited()
        }
        if (input.current) message.edit(input.current.innerText, user.token)
        setIsBeingEdited(null)
    }

    useEffect(() => {
        const listener = (e) => {
            if (e.code === "Escape") setIsBeingEdited(null)
        }
        document.addEventListener("keydown", listener)
        return () => document.removeEventListener("keydown", listener)
    }, [message.author])

    const formatter = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" })
    const time = formatter.format(new Date(message.timestamp.getHours()))

    return (
        <div style={{ fontSize: preferredSettings.fontSize + "px", marginTop: full ? "0.4em" : 0 }} id={message.id} className={`message-div ${message.unsent ? "unsent" : ""} ${(clicked || !!isBeingEdited) && "clicked"}`}>
            {full ?
                <div className="center-content">
                    <img id={`avatar-${message.id}`} onClick={click} width="40" height="40" className="author-icon" src={message.author.displayAvatarURL(90)} alt="avatar" />
                </div>
                :
                <div className="message-timestamp">
                <span className="timestamp">
                    <time>
                        {time}
                    </time>
                </span>
                </div>
            }
            <div className="message-content">
                {full && <span className="author-name"><span onClick={click} className="exact-author">{message.author.username}</span><span className="exact-time">{message.createdAt}</span></span>}
                <Text input={input} isBeingEdited={isBeingEdited} setIsBeingEdited={setIsBeingEdited} edit={edit} message={message} />
                <Attachments message={message} />
                {message.invite?._id && <Invite me={message.me} invite={message.invite} code={message.inviteCode} />}
                <div onClick={menu} tabIndex="0" className="message-params"><Dots size={22} /></div>
            </div>
        </div>
    )
}

export default MessageJSX