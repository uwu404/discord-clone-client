import "./note.css"

const Note = ({ user, display }) => {
    const saveNote = e => {
        try {
            localStorage.setItem(user.id, e.target.value)
        }
        catch (e) {
            if (e === DOMException.QUOTA_EXCEEDED_ERR) console.error("localStrorage quota exceeded")
        }
    }

    if (!display) return null
    return (
        <div className="note">
            <h5>NOTE</h5>
            <textarea onChange={saveNote} defaultValue={localStorage.getItem(user.id)} placeholder="Click to add a note"></textarea>
        </div>
    )
}

export default Note