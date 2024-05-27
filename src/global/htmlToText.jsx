const htmlToText = (text) => {
    const container = document.createElement("div")
    container.innerText = text
    return container.innerHTML
}

export default htmlToText