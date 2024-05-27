const handleSocketEvents = {
    message(setMessages, msg) {
        setMessages(prev => [...prev, msg])
    },
    memberOnline(setMembers, user) {
        setMembers(members => {
            const list = [...members]
            const member = list.find(m => m._id === user.user)
            if (member) member.status = user.status
            return list
        })
    },
    memberUpdate(setMembers, setMessages, user) {
        setMessages(prev => {
            const messages = [...prev]
            messages.forEach(m => {
                if (`${user._id}` === m.author._id) {
                    const updatedUser = Object.assign(m.author, user)
                    m.author = updatedUser
                }
            })
            return messages
        })
        setMembers(prev => {
            const members = [...prev]
            members.forEach(m => {
                if (`${user._id}` === m._id) {
                    const updatedUser = Object.assign(m, user)
                    m = updatedUser
                }
            })
            return members
        })
    },
    messageEdit(setMessages, msg) {
        setMessages(prev => {
            const list = [...prev]
            const message = list.find(m => m._id === msg._id)
            list[list.indexOf(message)] = Object.assign(message, msg)
            return list
        })
    },
    messageDelete(setMessages, msg) {
        setMessages(prev => [...prev].filter(m => m._id !== msg._id))
    },
    memberJoin(setMembers, member) {
        setMembers(prev => [...prev, member])
    },
    memberLeave(setMembers, member) {
        setMembers(prev => prev.filter(m => m._id !== member._id))
    }
}

export default handleSocketEvents