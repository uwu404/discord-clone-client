import Server from "."
import ServerJSX from "./server"

const MapServers = ({ servers }) => {
    const jsx = servers.map((s) => {
        const server = new Server(s)
        return <ServerJSX key={server.id} server={server} />
    })
    return jsx.reverse()
}

export default MapServers