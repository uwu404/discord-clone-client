// eslint-disable-next-line no-unused-vars
import { Socket } from "socket.io-client"

const servers = {
    iceServers: [
        {
            urls: [
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302',
                'stun:stun3.l.google.com:19302',
                'stun:stun4.l.google.com:19302',
            ],
        }
    ]
}

const voiceChat = {
    /** @type {MediaStream} */
    localStream: null,
    /** @type {Record<string, MediaStream>} */
    remoteStreams: {},
    /** @type {Record<string, RTCPeerConnection>} */
    peerConnections: {},
    /** @type {Socket} socket */
    socket: null,
    /** @param {{ audio: boolean, video: boolean }} options */
    async init(options, socket) {
        this.socket = socket
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia(options)
        } catch (error) {
            this.localStream = new MediaStream()
            console.error(error)
        }
    },
    /** 
     * @param {string} to
     * @param {string} user
    */
    createPeerConnection(to, user) {
        this.peerConnections[to] = new RTCPeerConnection(servers)
        this.remoteStreams[to] = new MediaStream()
        this.localStream.getTracks().forEach(track => {
            this.peerConnections[to].addTrack(track, this.localStream)
        })
        this.peerConnections[to].ontrack = e => {
            e.streams[0].getTracks().forEach(track => {
                this.remoteStreams[to].addTrack(track)
            })
        }
        this.peerConnections[to].onicecandidate = e => {
            if (e.candidate) {
                this.socket.emit("candidate", {
                    label: e.candidate.sdpMLineIndex,
                    id: e.candidate.sdpMid,
                    candidate: e.candidate.candidate,
                }, user, to)
            }
        }
    },
    /** 
     * @param {string} to
     * @param {string} user
    */
    async createOffer(to, user) {
        this.createPeerConnection(to, user)
        const offer = await this.peerConnections[to].createOffer()
        await this.peerConnections[to].setLocalDescription(offer)
        this.socket.emit("offer", offer, user, to)
    },
    /**
     * @param {RTCSessionDescriptionInit} offer
     * @param {string} to
     * @param {string} user
     */
    async createAnswer(offer, to, user) {
        this.createPeerConnection(to, user)
        await this.peerConnections[to].setRemoteDescription(offer)
        const answer = await this.peerConnections[to].createAnswer()
        await this.peerConnections[to].setLocalDescription(answer)
        this.socket.emit("answer", answer, user, to)
    },
    /** 
     * @param {RTCSessionDescriptionInit} answer
     * @param {string} user
     */
    addAnswer(answer, user) {
        if (!this.peerConnections[user].currentRemoteDescription) {
            this.peerConnections[user].setRemoteDescription(answer)
        }
    },
    /** 
     * @param {{ label: number, candidate: string }} candidate 
     * @param {string} user
     */
    handleIceCandidate(candidate, user) {
        const c = new RTCIceCandidate({
            sdpMLineIndex: candidate.label,
            candidate: candidate.candidate,
        })
        this.peerConnections[user].addIceCandidate(c)
    },
    /** @param {string} user */
    stopRemoteStreamtracks(user) {
        if (!this.remoteStreams[user]) return
        this.remoteStreams[user].getTracks().forEach(track => track.stop())
    },
    stopLocalStreamTrack() {
        if (!this.localStream) return
        this.localStream.getTracks().forEach(track => track.stop())
    },
    /** @param {string} user */
    hasAudioAndVideo(user) {
        const hasMedia = { video: false, audio: false }
        if (!this.remoteStreams[user]) return hasMedia
        if (this.remoteStreams[user].getAudioTracks().length) hasMedia.audio = true
        if (this.remoteStreams[user].getVideoTracks().length) hasMedia.video = true
        return hasMedia
    },
    deleteStreams() {
        this.remoteStreams = {}
    }
}

export default voiceChat