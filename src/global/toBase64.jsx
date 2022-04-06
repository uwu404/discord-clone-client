const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const img = new Image()
        img.onload = () => resolve(reader.result);
        img.src = reader.result
    }
    reader.onerror = error => reject(error);
});

export default toBase64