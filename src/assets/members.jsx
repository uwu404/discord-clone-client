const Skeleton = () => (
    <div className="member-skeleton">
        <div className="member-skeleton-pfp"></div>
        <div className="nice-div">
            <div className="member-skeleton-name"></div>
            {Math.random() > 0.5 && <div className="member-skeleton-status"></div>}
        </div>
    </div>
)

export default function MemberLoading({ times }) {
    return [...Array(times)].map((_, i) => <Skeleton key={i} />)
}