// this should've been added when i just started but it's never too late ig
import { link } from "../config.json"

const endpoints = {
    /** @param {string} server */
    deleteServer(server) {
        return {
            method: "DELETE",
            endpoint: `${link}servers/${server}`
        }
    },
    /** @param {string} server */
    editServer(server) {
        return {
            method: "PATCH",
            endPoint: `${link}servers/${server}`
        }
    },
    editUser() {
        return {
            method: "PATCH",
            endPoint: `${link}user/edit`
        }
    },
    getVCconnections() {
        return {
            method: "GET",
            endPoint: `${link}user/connections`
        }
    },
    /** @param {string} server */
    createCustomInvite(server) {
        return {
            method: "POST",
            endPoint: `${link}servers/${server}/invites`
        }
    },
    login() {
        return {
            method: "POST",
            endPoint: `${link}login`
        }
    },
    user: link + "user"
}

export default endpoints