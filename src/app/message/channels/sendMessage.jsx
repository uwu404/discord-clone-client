import { link } from "../../../config.json"

const sendMessage = async (message, channelId, token) => {
    const msg = await fetch(`${link}channels/${channelId}/messages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(message)
    })
        .then(res => res.json())

    return msg
}

export default sendMessage