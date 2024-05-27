import toBase64 from "./toBase64"

export const dropFile = async (e) => {
    e.stopPropagation()
    e.preventDefault()
    const items = e.dataTransfer.items
    const file = items[0]?.getAsFile()
    const base64str = await toBase64(file).catch(() => 0)
    return { data: base64str, fileName: file?.name }
}

export const getImageFromPaste = async (e) => {
    const items = e.clipboardData.items
    const file = items[1]?.getAsFile()
    const base64str = await toBase64(file).catch(() => 0)
    return { data: base64str, fileName: file?.name }
}

export const getImageFromInput = async (e) => {
    const file = e.target.files[0]
    const base64str = await toBase64(file).catch(() => 0)
    e.target.value = ""
    return { data: base64str, fileName: file?.name }
}