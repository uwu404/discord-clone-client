const createMessage = async (k, user, channel, setMessages, attachments, setAttachments, done) => {
    if (k.code !== "Enter") return
    k.preventDefault?.();
    if (!k.target.textContent.trim() && !attachments.length) return
    const message = { author: user, content: k.target.innerText.trim(), _id: `m${Date.now()}`, createdAt: Date.now(), unsent: true, channel: channel.id, updatedAt: Date.now(), attachment: attachments?.[0]?.data }
    setMessages(prev => [...prev, message])
    if (attachments?.length) setAttachments([])
    channel.send(message)
        .then(msg => {
            const update = Object.assign(message, { _id: msg.id, unsent: false, invite: msg.invite, content: msg.content })
            if (msg.attachment?.URL) update.attachment = msg.attachment
            setMessages(prev => {
                const allMessages = [...prev]
                const find = allMessages.find(ms => ms._id === message._id)
                allMessages[allMessages.indexOf(find)] = update
                return allMessages
            })
            update.author.online = msg.author.online
        })
        .catch((err) => {
            console.error(err)
            setMessages(prev => {
                const list = [...prev]
                const find = list.find(ms => ms._id === message._id)
                if (find) find.failed = true
                return list
            })
        })
    done?.()
    k.target.textContent = ""
}

export default createMessage

