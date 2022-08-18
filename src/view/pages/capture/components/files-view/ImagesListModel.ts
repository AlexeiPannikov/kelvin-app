import {ImageModel} from "./ImageModel";

export class ImagesListModel {
    list: ImageModel[] = []
    dragMode = false
    private dragStarted = false
    private imageCopyNode: Node = null
    private imageCopyWrap: HTMLDivElement = null
    private shiftX = 0;
    private shiftY = 0;

    selectFile(event: MouseEvent, name: string) {
        if (event.ctrlKey)
            this.list.forEach(item => {
                if (item.name === name) {
                    item.isSelected = !item.isSelected
                }
            })
        else
            this.list.forEach(item => {
                item.name === name && !item.isSelected ? item.isSelected = true : item.isSelected = false
            })
    }

    resetSelect() {
        this.list.forEach(item => item.isSelected = false)
    }

    dragStart(e: MouseEvent) {
        this.dragMode = true
        this.imageCopyNode = (e.target as HTMLElement).cloneNode()
        this.shiftX = e.clientX
        this.shiftY = e.clientY
    }

    drag(e: MouseEvent) {
        if (!this.dragMode) return
        if (!this.dragStarted) {
            const selectedImages = this.list.filter(({isSelected}) => isSelected)
            this.imageCopyWrap = document.createElement("div")
            this.imageCopyWrap.appendChild(this.imageCopyNode)
            this.imageCopyWrap.style.position = "fixed"
            this.imageCopyWrap.style.zIndex = "5000"
            this.imageCopyWrap.style.opacity = "0.5"
            this.imageCopyWrap.style.width = "100px"
            this.imageCopyWrap.style.height = "100px"
            if (selectedImages.length > 1) {
                const counterEl = document.createElement("div")
                counterEl.style.width = "40px"
                counterEl.style.height = "40px"
                counterEl.style.display = "flex"
                counterEl.style.alignItems = "center"
                counterEl.style.justifyContent = "center"
                counterEl.style.backgroundColor = "#499FFF"
                counterEl.style.color = "white"
                counterEl.style.borderRadius = "50%"
                this.imageCopyWrap.appendChild(counterEl)
            }
            document.body.appendChild(this.imageCopyWrap)
            this.dragStarted = true
        }
        this.imageCopyWrap.style.left = e.pageX - 50 + "px";
        this.imageCopyWrap.style.top = e.pageY - 50 + "px";
    }

    dragEnd() {
        if (!this.dragMode) return
        this.dragMode = false
        this.dragStarted = false
        if (this.imageCopyWrap) {
            this.imageCopyWrap.remove()
        }
        this.imageCopyNode = null
        this.imageCopyWrap = null
    }

    subscribes() {
        document.addEventListener("mouseup", this.dragEnd.bind(this))
        document.addEventListener("mouseleave", this.dragEnd.bind(this))
        document.addEventListener("mousemove", this.drag.bind(this))
    }

    unsubscribes() {
        document.removeEventListener("mouseup", this.dragEnd.bind(this))
        document.removeEventListener("mouseleave", this.dragEnd.bind(this))
        document.removeEventListener("mousemove", this.drag.bind(this))
    }
}