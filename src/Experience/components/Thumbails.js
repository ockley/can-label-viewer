export class Thumbnails {
    constructor(data, container) {
        this.container = container
        this.data = data

        this.thumbnails = []

        this.createThumbnails()
    }

    createThumbnails() {
        this.data.forEach((can, index) => {
            const thumbnail = document.createElement('img')
            thumbnail.src = can.path
            thumbnail.alt = can.name
            thumbnail.classList.add('thumbnail')
            thumbnail.addEventListener('click', () => this.onThumbnailClick(can))
            this.container.appendChild(thumbnail)
            this.thumbnails.push(thumbnail)
        })
    }

    onThumbnailClick(can) {
        // Her bruger vi CustomEvent til at sende information om den valgte dåse op gennem komponenthierarkiet
        // Læg mærke til at vi egentlig bare videresender can-objektet som vi modtog fra click-listeneren
        const event = new CustomEvent('canSelected', { detail: can })
        window.dispatchEvent(event)
    }
}