import { useEffect, useRef, useState } from "react"

const saveSelection = (containerEl, newTextLength) => {
    const range = window.getSelection().getRangeAt(0)
    const preSelectionRange = range.cloneRange()
    preSelectionRange.selectNodeContents(containerEl)
    preSelectionRange.setEnd(range.startContainer, range.startOffset)
    const start = `${preSelectionRange}`.length

    return {
        start: start + newTextLength,
        end: start + `${range}`.length + newTextLength,
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

const Input = ({ renderId, onChange, value, innerRef, placeholder, defaultValue, onPaste, onKeyDown, className, ...props }) => {
    const divRef = useRef()
    const keepValue = useRef(defaultValue)
    const [innerHTML, setInnerHTML] = useState({ selected: null, text: "" })

    const add = (el, text) => {
        const savedSelection = saveSelection(el, text.length)
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
        handleInput(e)
        onPaste?.(e)
        scrollToBottom(e.target)
    }

    const handleKeyDown = (e) => {
        if (e.key === "z" && e.ctrlKey && !e.shiftKey) return
        if (e.code === "Enter" && e.shiftKey) return
        onKeyDown?.(e)
        scrollToBottom(e.target)
        if (e.code === "Backspace" && e.target.innerText.length <= 1) e.target.innerHTML = ""
        setTimeout(() => onChange?.(e), 1)
        if (e.code === "Enter" && !e.defaultPrevented) {
            e.preventDefault()
            const selection = saveSelection(e.target, 1)
            setInnerHTML(prev => ({ text: prev.text.slice(0, selection.pos[0]) + (selection.pos[1] !== prev.text.length ? "\n" : "\n\n") + prev.text.slice(selection.pos[1]).trim(), selected: selection }))
        }
    }

    const handleDrop = e => {
        e.preventDefault()
        const text = e.dataTransfer.getData("text/plain")
        e.target.textContent = e.target.textContent + text
        setSelection(e.target, { start: e.target.textContent.length - text.length, end: e.target.textContent.length })
        scrollToBottom(e.target)
        handleInput(e)
    }

    const handleInput = (e) => {
        const selection = saveSelection(e.target, 0)
        setInnerHTML({
            text: e.target.innerText,
            selected: selection,
        })
        onChange?.(e)
    }

    useEffect(() => {
        if (value !== undefined) setInnerHTML(prev => ({ ...prev, text: value }))
    }, [value])

    useEffect(() => {
        if (!keepValue.current) return
        divRef.current.lastChild.focus()
        const selection = saveSelection(divRef.current, keepValue.current?.length)
        setInnerHTML({ selected: selection, text: keepValue.current })
    }, [])

    useEffect(() => {
        if (innerHTML.selected) setSelection(document.activeElement, innerHTML.selected)
    }, [innerHTML])

    useEffect(() => {
        if (renderId) {
            const input = divRef.current.lastChild
            input.focus()
            setSelection(input, { start: input.textContent.length, end: input.textContent.length })
        }
    }, [renderId])

    return (
        <div
            ref={divRef}
            className={"not-input " + className}
            onPaste={handlePaste}
            onDrop={handleDrop}
            onKeyDown={handleKeyDown}
            role="textbox"
            spellCheck={false}
            {...props}>
            <div
                onInput={handleInput}
                ref={innerRef}
                suppressContentEditableWarning={true}
                placeholder={placeholder}
                contentEditable="true"
                className="plain-text">
                {innerHTML.text}
            </div>
        </div>
    )
}

export default Input