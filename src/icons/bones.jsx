const Skeleton = () => {
    return (
        <div className="skeleton">
            <div className="skeleton-pfp"></div>
            <div style={{ width: Math.floor(Math.random() * 100) + 100 }} className="skeleton-username"></div>
            <div>
                <div style={{ width: "calc(20% - 70px/4)" }} className="skeleton-content-1 sl"></div>
                <div style={{ width: "calc(30% - 70px/4)" }} className="skeleton-content-2 sl"></div>
                <div style={{ width: "calc(15% - 70px/4)" }} className="skeleton-content-3 sl"></div>
                <div style={{ width: "calc(25% - 70px/4)" }} className="skeleton-content-4 sl"></div>
            </div>
            {Math.random() < 0.4 &&
                <div className="random-sl">
                    <div style={{ width: "calc(25% - 70px/4)", display: "inline-block" }} className="skeleton-content-1 sl"></div>
                    <div style={{ width: "calc(20% - 70px/4)", display: "inline-block" }} className="skeleton-content-2 sl"></div>
                    <div style={{ width: "calc(30% - 70px/4)", display: "inline-block" }} className="skeleton-content-3 sl"></div>
                    <div style={{ width: "calc(15% - 70px/4)", display: "inline-block" }} className="skeleton-content-4 sl"></div>
                </div>
            }
            {Math.random() < 0.1 && <div className="skeleton-content-a"></div>}
        </div>
    )
}

export default function SkeletonLoadingMessage() {
    return [...Array(20)].map((_, i) => <Skeleton key={i} />)
}