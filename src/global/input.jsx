import { useEffect, useRef } from "react"

const saveSelection = (containerEl, newText) => {
    const range = window.getSelection().getRangeAt(0)
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(containerEl)
    preSelectionRange.setEnd(range.startContainer, range.startOffset)
    const start = `${preSelectionRange}`.length

    return {
        start: start + newText.length,
        end: start + `${range}`.length + newText.length,
        pos: [start, `${range}`.length + start]
    }
}

const setSelection = (containerEl, savedSel) => {
    let charIndex = 0
    let range = document.createRange();
    range.setStart(containerEl, 0);
    range.collapse(true);
    let nodeStack = [containerEl]
    let node
    let foundStart = false
    let stop = false

    while (!stop && (node = nodeStack.pop())) {
        if (node.nodeType === 3) {
            const nextCharIndex = charIndex + node.length;
            if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                range.setStart(node, savedSel.start - charIndex)
                foundStart = true
            }
            if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                range.setEnd(node, savedSel.end - charIndex)
                stop = true
            }
            charIndex = nextCharIndex
        } else {
            let i = node.childNodes.length
            while (i--) {
                nodeStack.push(node.childNodes[i])
            }
        }
    }

    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
}

const getScrollParent = node => {
    if (!node) return
    if (node.style?.overflowY === "auto") return node
    if (node.scrollHeight > node.clientHeight) return node
    return getScrollParent(node.parentNode)
}

const Input = ({ renderId, placeholder, defaultValue, innerRef, onPaste, onKeyDown, ...props }) => {
    const divRef = useRef()
    const add = (el, text) => {
        const savedSelection = saveSelection(el, text)
        el.textContent = el.textContent.slice(0, savedSelection.pos[0]) + text + el.textContent.slice(savedSelection.pos[1])
        setSelection(el, savedSelection)
    }

    const scrollToBottom = element => {
        const firstScrollableParent = getScrollParent(element)
        if (firstScrollableParent) firstScrollableParent.scrollTop = firstScrollableParent.scrollHeight
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const text = e.clipboardData.getData("text")
        if (text) add(e.target, text)
        onPaste?.(e)
        scrollToBottom(e.target)
    }

    const handleKeyDown = (e) => {
        if (e.code === "Backspace" && e.target.textContent.length <= 1) e.target.innerHTML = ""
        if (e.key === "z" && e.ctrlKey && !e.shiftKey) return
        if (e.code === "Enter" && e.shiftKey) return
        onKeyDown?.(e)
        scrollToBottom(e.target)
    }

    const handleDrop = e => {
        e.preventDefault()
        const text = e.dataTransfer.getData("text/plain")
        e.target.textContent = e.target.textContent + text
        setSelection(e.target, { start: e.target.textContent.length - text.length, end: e.target.textContent.length })
        scrollToBottom(e.target)
    }

    useEffect(() => {
        const input = divRef.current.lastChild
        input.focus()
        setSelection(input, { start: input.textContent.length, end: input.textContent.length })
    }, [renderId])

    return (
        <div
            ref={divRef}
            className="not-input"
            onPaste={handlePaste}
            onDrop={handleDrop}
            onKeyDown={handleKeyDown}
            role="textbox"
            {...props}>
            <div ref={innerRef} suppressContentEditableWarning={true} placeholder={placeholder} contentEditable="true" className="plain-text">
                {defaultValue}
            </div>
        </div>
    )
}

export default Input