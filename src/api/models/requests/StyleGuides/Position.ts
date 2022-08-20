import {Asset} from "./Asset";
import {FileDataModel} from "../../responses/Files/FileDataModel";
import {ImageModel} from "../../../../view/pages/capture/components/files-view/ImageModel";
import imagesInFolder from "../../../../view/pages/capture/components/files-view/ImagesList"
import {ImagesList} from "../../../../view/pages/capture/components/files-view/ImagesList";
import {v4 as uuidv4} from "uuid"
import {UnwrapNestedRefs} from "vue";

export class Position {
    id = uuidv4()
    fileIds: string[] = []
    filesInner: FileDataModel[] = []
    name = ""
    description = ""
    is_bypass_external_post_production = false
    is_color_reference = false
    is_enforce_alts = false
    is_hero = false
    is_optional = false
    is_photo_review = false
    min_shots_alts = 0
    coverFile: FileDataModel = new FileDataModel();
    cover_file_uuid: string;
    photography = {
        maxShots: 2,
        minShots: 1
    };
    asset: Asset = new Asset()
    images = new ImagesList()
    altsImages = new ImagesList()
    errorMessage = ""

    constructor(obj?: Partial<Position>) {
        if (obj) {
            Object.assign(this, obj)
            this.asset = new Asset(obj.asset)
        }
        this.coverFile.uuid = this.cover_file_uuid
        this.filesInner = this.fileIds.map(uuid => new FileDataModel({uuid}))
        this.asset = new Asset(obj.asset)
    }

    subscribes() {
        const mainDropZone = document.getElementById(this.id.toString())
        const altDropZone = document.getElementById(`alt-${this.id}`)
        if (!mainDropZone) return
        mainDropZone.onmouseenter = this.mouseenterMainZoneHandler.bind(this)
        mainDropZone.onmouseleave = this.mouseleaveMainZoneHandler.bind(this)
        if (!altDropZone) return;
        altDropZone.onmouseenter = this.mouseenterAltZoneHandler.bind(this)
        altDropZone.onmouseleave = this.mouseleaveAltZoneHandler.bind(this)
        window.onmouseup = this.deleteImages.bind(this)
    }

    deleteImages() {
        if (this.images.dragStarted) {
            this.images.list = this.images.list.filter(({isSelected}) => !isSelected)
        }
        if (this.altsImages.dragStarted) {
            this.altsImages.list = this.altsImages.list.filter(({isSelected}) => !isSelected)
        }
    }

    unsubscribes() {
        const mainDropZone = document.getElementById(this.id.toString())
        const altDropZone = document.getElementById(`alt-${this.id}`)
        mainDropZone.onmouseenter = null
        mainDropZone.onmouseleave = null
        // mainDropZone.removeEventListener("mouseup", this.validationMain.bind(this))
        altDropZone.onmouseenter = null
        altDropZone.onmouseleave = null
        // altDropZone.removeEventListener("mouseup", this.validationAlt.bind(this))
    }

    private getSelectedImages = (list: UnwrapNestedRefs<ImagesList> | ImagesList) => list.list.filter(({isSelected}) => isSelected)
        .map(item => new ImageModel({...item, uuid: uuidv4()}))

    private get selectedImagesInFolder() {
        return this.getSelectedImages(imagesInFolder)
    }

    private get selectedImagesInMain() {
        return this.getSelectedImages(this.images)
    }

    private get selectedImagesInAlts() {
        return this.getSelectedImages(this.altsImages)
    }

    private get isDisabledDragMode() {
        return !imagesInFolder.dragMode && !this.images.dragMode && !this.altsImages.dragMode
    }

    private mainListFilter(image: ImageModel) {
        return !this.images.list.find(item => item.id === image.id)
    }

    private altListFilter(image: ImageModel) {
        return !this.altsImages.list.find(item => item.id === image.id)
    }

    private getSelectedElements(list: ImagesList) {
        const uuidList = list.list.filter(({isSelected}) => isSelected).map(({uuid}) => uuid)
        return uuidList.map(uuid => document.getElementById(uuid))
    }

    mouseenterMainZoneHandler(e: MouseEvent) {
        e.preventDefault()
        if (this.isDisabledDragMode) return
        this.images.list.push(
            ...this.selectedImagesInFolder.filter(this.mainListFilter.bind(this)),
            ...this.selectedImagesInAlts.filter(this.mainListFilter.bind(this))
        )
        const elements = this.getSelectedElements(this.images)
        elements.forEach(el => {
            if (el) el.style.display = "block"
        })
        this.images.list.forEach(item => item.isSelected = false)
    }

    mouseleaveMainZoneHandler(e: MouseEvent) {
        e.preventDefault()
        if (this.images.dragMode) {
            const elements = this.getSelectedElements(this.images)
            elements.forEach(el => el.style.display = "none")
            const mainDropZone = document.getElementById(this.id.toString())
            const mouseupHandler = (e: MouseEvent) => {
                if (!mainDropZone.contains(e.target as Node))
                    this.images.list = this.images.list.filter(({isSelected}) => !isSelected)
                this.images.list.forEach(item => item.isSelected = false)
                mainDropZone.onmouseup = null
            }
            mainDropZone.onmouseup = mouseupHandler.bind(this)
        }
    }

    mouseenterAltZoneHandler(e: MouseEvent) {
        e.preventDefault()
        if (this.isDisabledDragMode) return
        this.altsImages.list.push(
            ...this.selectedImagesInFolder.filter(this.altListFilter.bind(this)),
            ...this.selectedImagesInMain.filter(this.altListFilter.bind(this))
        )
        const elements = this.getSelectedElements(this.altsImages)
        elements.forEach(el => {
            if (el) el.style.display = "block"
        })
    }

    mouseleaveAltZoneHandler(e: MouseEvent) {
        e.preventDefault()
        if (this.altsImages.dragMode) {
            const elements = this.getSelectedElements(this.altsImages)
            elements.forEach(el => el.style.display = "none")
            const altDropZone = document.getElementById(`alt-${this.id}`)
            const mouseupHandler = (e: MouseEvent) => {
                if (!altDropZone.contains(e.target as Node))
                    this.altsImages.list = this.altsImages.list.filter(({isSelected}) => !isSelected)
                altDropZone.onmouseup = null
                this.altsImages.list.forEach(item => item.isSelected = false)
            }
            altDropZone.onmouseup = mouseupHandler.bind(this)
        }
    }

    resetSelect() {
        this.images.list.forEach(item => item.isSelected = false)
        this.altsImages.list.forEach(item => item.isSelected = false)
    }
}