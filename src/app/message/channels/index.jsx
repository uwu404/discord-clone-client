import { useContext, useMemo } from "react"
import Channel from "../../../classes/channel"
import { AppContext } from ".."
import Footer from "../../../classes/user/me/footer"
import { useParams } from "react-router-dom"
import Title from "../../../classes/channel/title"
import MapChannels from "../../../classes/channel/mapChannels"
import ServerMenu from "../../../classes/server/serverMenu/serverMenu"
import Members from "./members"
import Chat from "./chat"

const Main = ({ server }) => {
    const { setLayer } = useContext(AppContext)
    const params = useParams()
    const channel = useMemo(() => new Channel(server.channels.find(c => c._id === params.channel) || server.channels[0]), [server.channels, params.channel])

    return (
        <main className="flexible-container">
            <section className="left-part">
                <ServerMenu server={server} />
                <div className="channels">
                    <div className="i-pad">
                        <ul>
                            <MapChannels server={server} channels={server?.channels} />
                        </ul>
                    </div>
                </div>
                <Footer setLayer={setLayer} />
            </section>
            <section className="messages">
                <div className="name">
                    <Title channel={channel} />
                </div>
                <Chat channel={channel} />
                <Members server={server} />
            </section>
        </main>
    )
}

export default Main