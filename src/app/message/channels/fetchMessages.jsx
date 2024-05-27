import { link } from "../../../config.json"

const fetchMessages = async (channelId, token) => {
    const messages = await fetch(`${link}channels/${channelId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(res => res.json())
        .catch(() => [])

    return messages
}

export default fetchMessages