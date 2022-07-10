class exHentaiCtrl {
    constructor() {
        this.gallery = {
            container: null,
            rows: null,
            ready: false
        }
        this.thumbnail = {
            active: null
        }
        this.options = {
            autoScrollPadding: 20
        }
        this.attachHeader()
        this.bind()
    }

    loaded = () => {
        console.log('Page Loaded! 😊')
        setTimeout(_ => this.initPage(), 100)
    }

    initPage = ({ target = null } = {}) => {
        const path = window.location.search || window.location.pathname
        // console.log('location', window.location, 'location path', path)
        if (target = document.querySelector("#gdt, .itg.gld")) {
            this.enableWASD(target)
        }
        if (target = document.querySelector(".sni")) {
            this.enableVIEW(target)
        }

    }

    attachHeader = () => {
        observeFor('#nb', _ => {
            tmpl8({
                markup: `
                    <div><a class="nbw" href="">exHentai-CTRL Options</a></div>
            `,
                appendTo: _
            })
        }, true)
    }

    bind = () => {
        window.addEventListener('keydown', this.keydown)
    }

    enableVIEW = () => {
        this.gallery.ready = true
    }

    enableWASD = (target) => {
        if (!target) {
            this.loaded()
            return
        }
        console.log('target', target)
        this.gallery.container = target
        this.getGalleryNodes()
        const firstThumbnail = this.gallery.nodes[0]
        this.selectThumbnail(firstThumbnail)
        this.gallery.ready = true
    }

    getGalleryNodes = () => {
        this.gallery.nodes = [...this.gallery.container.childNodes].filter(_ => _.childNodes.length > 0)
    }

    calculateGrid = () => {
        this.gallery.rows = Math.floor(this.gallery.container.clientWidth / this.thumbnail.active.clientWidth)
    }

    selectThumbnail = (node) => {
        this.thumbnail.active?.classList.remove('highlighted-thumb')
        this.thumbnail.active = node
        this.thumbnail.active.classList.add('highlighted-thumb')
        this.boundsCheck(node)
    }

    keydown = (e) => {
        if (!this.gallery.ready) return false
        switch (e.code) {
            case "KeyE":
                this.pressEonThumb()
                break
            case "KeyQ":
                history.back()
                break
            case "KeyB":
                console.log('exHentaiCtrl', this)
                break
            case "KeyW": case "KeyA": case "KeyS": case "KeyD":
                this.moveHighlight(e)
                break
            default:
                break
        }
    }

    moveHighlight = (e) => {
        this.calculateGrid()
        const nodeIndex = this.gallery.nodes.indexOf(this.thumbnail.active)
        let next
        switch (e.code) {
            case 'KeyW':
                if (nodeIndex < this.gallery.rows) {
                    window.scrollTo(0, 0)
                    break // ALREADY ON FIRST ROW
                }
                next = this.gallery.nodes[nodeIndex - this.gallery.rows]
                break
            case 'KeyA':
                if (nodeIndex <= 0) break // ALREADY ON FIRST THUMBNAIL
                next = this.gallery.nodes[nodeIndex - 1]
                break
            case 'KeyS':
                if (nodeIndex > this.gallery.nodes.length - this.gallery.rows - 1) {
                    next = this.gallery.nodes[this.gallery.nodes.length - 1]
                    break
                } // ALREADY ON LAST ROW
                next = this.gallery.nodes[nodeIndex + this.gallery.rows]
                break
            case 'KeyD':
                if (nodeIndex >= this.gallery.nodes.length - 1) break // ALREADY ON LAST THUMBNAIL
                next = this.gallery.nodes[nodeIndex + 1]
                break
        }
        if (next) this.selectThumbnail(next)
    }

    boundsCheck = (node) => {
        const nodeBounds = node.getBoundingClientRect()
        let initScroll = window.scrollY
        switch (true) {
            case (nodeBounds.top < 0):
                initScroll += nodeBounds.top - this.options.autoScrollPadding
                break
            case (nodeBounds.bottom > window.innerHeight):
                initScroll += (nodeBounds.bottom - window.innerHeight) + this.options.autoScrollPadding
                break
        }
        window.scrollTo(0, initScroll)
    }

    pressEonThumb = () => {
        const thumbnailAnchor = this.thumbnail.active.querySelector('a')
        const thumbnailLink = thumbnailAnchor.href
        window.location = thumbnailLink
    }

    pressAonFirst = () => {

    }

    pressDonLast = () => {

    }

}

window.eXHentaiCtrl = new exHentaiCtrl()
window.addEventListener('load', window.eXHentaiCtrl.loaded)
