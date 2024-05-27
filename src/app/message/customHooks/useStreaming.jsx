import { useEffect, useState } from "react"
import voiceChat from "../../../classes/channel/voiceChat"

const useStreaming = (connection, user, connectionOptions, socket) => {
    const [streams, setStreams] = useState({})

    useEffect(() => {
        const channel = connection?.id
        let isMounted = true

        const handleUserJoining = (userJoining, channel) => {
            if (channel._id !== connection.id) return
            if (userJoining._id === user._id) return
            voiceChat.createOffer(userJoining._id, user._id)
        }
        
        const handleUserLeaving = user => {
            if (voiceChat.remoteStreams[user._id]) {
                const keys = Object.keys(voiceChat.remoteStreams)
                    .filter(u => u !== user._id)
                setStreams(keys.map(k => voiceChat.remoteStreams[k]))
            }
        }

        if (channel) {
            voiceChat.init({ audio: true, video: false }, socket).then(() => {
                if (!isMounted) return
                socket.emit("joinvc", connection.id, user.token)
                socket.on("joinvc", handleUserJoining)
                socket.on("offer", (offer, userId) => {
                    voiceChat.createAnswer(offer, userId, user._id)
                })
                socket.on("answer", (answer, userId) => {
                    voiceChat.addAnswer(answer, userId)
                })
                socket.on("candidate", (candidate, userId) => {
                    voiceChat.handleIceCandidate(candidate, userId)
                    setStreams({ ...voiceChat.remoteStreams })
                })
                socket.on("leavevc", handleUserLeaving)
            })
        }
        return () => {
            socket.off("joinvc", handleUserJoining)
                .off("answer")
                .off("offer")
                .off("candidate")
                .off("leavevc", handleUserLeaving)
            if (channel) socket.emit("leavevc", channel, user.token)
            voiceChat.stopLocalStreamTrack()
            setStreams({})
            voiceChat.deleteStreams()
            isMounted = false
        }
    }, [connection, user.token, user._id, socket])

    useEffect(() => {
        const audioTrack = voiceChat.localStream?.getTracks().find(track => track.kind === "audio")
        if (audioTrack) audioTrack.enabled = connectionOptions.audio
    }, [connectionOptions, connection, streams])

    return streams
}

export default useStreaming