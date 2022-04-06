const isGif = (base64str) => {
    const byteCharacters = window.atob(base64str.split(",")[1])
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    if (byteArray[0] !== 0x47 || byteArray[1] !== 0x49 || byteArray[2] !== 0x46 || byteArray[3] !== 0x38) return false
    return true
}

export default isGif