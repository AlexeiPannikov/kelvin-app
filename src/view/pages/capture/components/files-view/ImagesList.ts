import {ImageModel} from "./ImageModel";
import {reactive} from "vue";

export class ImagesList {
    list: ImageModel[] = []
    dragMode = false
    private isElCreated = false
    private madeAChoiceInMotion = false
    private imageCopyNode: Node = null
    private imageCopyWrap: HTMLDivElement = null
    private shiftX = 0;
    private startX = 0;
    private shiftY = 0;
    private startY = 0;
    private isMouseDown = false;

    constructor(obj?: Partial<ImagesList>) {
        if (obj) Object.assign(this, obj)
    }

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

    choiceInMotion(event: MouseEvent, name: string) {
        const departureFromStartX = Math.abs(event.pageX - this.startX)
        const departureFromStartY = Math.abs(event.pageY - this.startY)
        if (!this.madeAChoiceInMotion && (departureFromStartX < 8 || departureFromStartY < 8)) return
        if (this.isMouseDown && !event.ctrlKey && this.list.filter(({isSelected}) => isSelected).length < 2) {
            this.list.forEach(item => {
                if (item.name === name) {
                    item.isSelected = true
                }
            })
            this.isMouseDown = false
        }
        this.madeAChoiceInMotion = true
    }

    resetSelect() {
        this.list.forEach(item => item.isSelected = false)
    }

    dragStart(e: MouseEvent) {
        this.dragMode = true
        this.isMouseDown = true
        this.subscribes.call(this)
        const target = e.target as HTMLElement
        this.imageCopyNode = target.cloneNode()
        this.startX = e.clientX
        this.startY = e.clientY
        this.shiftX = e.clientX
        this.shiftY = e.clientY
    }

    drag(e: MouseEvent) {
        if (!this.dragMode) return
        const departureFromStartX = Math.abs(e.pageX - this.startX)
        const departureFromStartY = Math.abs(e.pageY - this.startY)
        if (!this.isElCreated && (departureFromStartX > 8 || departureFromStartY > 8)) {
            const selectedImages = this.list.filter(({isSelected}) => isSelected)
            if (!selectedImages.length) return;
            this.imageCopyWrap = document.createElement("div")
            this.imageCopyWrap.appendChild(this.imageCopyNode)
            this.imageCopyWrap.style.position = "fixed"
            this.imageCopyWrap.style.zIndex = "5000"
            this.imageCopyWrap.style.opacity = "0.5"
            this.imageCopyWrap.style.width = "130px"
            this.imageCopyWrap.style.height = "130px"
            this.imageCopyWrap.style.display = "flex"
            this.imageCopyWrap.style.justifyContent = "center"
            this.imageCopyWrap.style.pointerEvents = "none"
            const counterEl = document.createElement("div")
            counterEl.style.minWidth = "25px"
            counterEl.style.minHeight = "25px"
            counterEl.style.padding = "4px 10px"
            counterEl.style.fontSize = "13px"
            counterEl.style.display = "flex"
            counterEl.style.alignItems = "center"
            counterEl.style.justifyContent = "center"
            counterEl.style.alignSelf = "flex-end"
            counterEl.style.backgroundColor = "#499FFF"
            counterEl.style.color = "white"
            counterEl.style.borderRadius = "50%"
            counterEl.style.marginBottom = "4px"
            counterEl.innerText = selectedImages.length.toString()
            this.imageCopyWrap.appendChild(counterEl)
            document.body.appendChild(this.imageCopyWrap)
            this.isElCreated = true
        }
        if (!this.imageCopyWrap) return;
        this.imageCopyWrap.style.left = e.pageX - 65 + "px";
        this.imageCopyWrap.style.top = e.pageY - 65 + "px";
    }

    dragEnd() {
        if (!this.dragMode) return
        this.isElCreated = false
        this.isMouseDown = false
        if (this.imageCopyWrap) {
            this.imageCopyWrap.remove()
        }
        this.imageCopyNode = null
        this.imageCopyWrap = null
        this.madeAChoiceInMotion = true
        this.unsubscribes.call(this)
        setTimeout(() => this.dragMode = false, 0)
    }

    deleteImages(names: string[]) {
        this.list = this.list.filter(item => !names.find(name => name === item.name))
    }

    subscribes() {
        document.onmouseup = this.dragEnd.bind(this)
        document.onmouseleave = this.dragEnd.bind(this)
        document.onmousemove = this.drag.bind(this)
    }

    unsubscribes() {
        document.onmouseup = null
        document.onmouseleave = null
        document.onmousemove = null
    }
}

export default reactive(new ImagesList())