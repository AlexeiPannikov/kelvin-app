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

    get isValidNumberOfPictures() {
        return this.images.list.length >= this.photography.minShots && this.images.list.length <= this.photography.maxShots
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
    }

    unsubscribes() {
        const mainDropZone = document.getElementById(this.id.toString())
        const altDropZone = document.getElementById(`alt-${this.id}`)
        if (mainDropZone) {
            mainDropZone.onmouseenter = null
            mainDropZone.onmouseleave = null
        }
        if (altDropZone) {
            altDropZone.onmouseenter = null
            altDropZone.onmouseleave = null
        }
    }

    private getSelectedImages = (list: UnwrapNestedRefs<ImagesList> | ImagesList) => list.list.filter(({isSelected}) => {
        return list.dragMode && isSelected
    })
        .map(item => new ImageModel({...item}))

    private get selectedImagesInFolder() {
        return [...this.getSelectedImages(imagesInFolder)]
    }

    private get selectedImagesInMain() {
        return [...this.getSelectedImages(this.images)]
    }

    private get selectedImagesInAlts() {
        return [...this.getSelectedImages(this.altsImages)]
    }

    private get isDisabledDragMode() {
        return !imagesInFolder.dragMode && !this.images.dragMode && !this.altsImages.dragMode
    }

    private mainListFilter(image: ImageModel) {
        const isFileExist = !!this.images.list.find(item => item.name === image.name) ||
            !!this.altsImages.list.find(item => item.name === image.name)
        if (isFileExist) {
            this.setErrorMessage("exist")
        }
        return !isFileExist
    }

    private altListFilter(image: ImageModel) {
        const isFileExist = !!this.altsImages.list.find(item => item.name === image.name) ||
            !!this.images.list.find(item => item.name === image.name)
        if (isFileExist) {
            this.setErrorMessage("exist")
        }
        return !isFileExist
    }

    setErrorMessage(type: "many" | "exist") {
        if (this.errorMessage) return
        if (type === "many")
            this.errorMessage = "To many files"
        if (type === "exist")
            this.errorMessage = "Some files already exist"
        setTimeout(() => this.errorMessage = "", 2000)
    }

    isFileExist() {
        const isFileExist = this.selectedImagesInFolder.find(item =>
            !!this.images.list.find(img => img.name === item.name) ||
            !!this.altsImages.list.find(img => img.name === item.name)
        )
        if (isFileExist) {
            this.setErrorMessage("exist")
            return true
        }
    }

    isToManyFiles() {
        const isInTheRange = (this.altsImages.list.filter(({isSelected}) => isSelected).length + this.images.list.length <= this.photography.maxShots) &&
            (imagesInFolder.list.filter(({isSelected}) => isSelected).length + this.images.list.length <= this.photography.maxShots)
        if (!isInTheRange) {
            this.setErrorMessage("many")
            return true
        }
    }

    globalMouseupHandler(e: MouseEvent) {
        const mainDropZone = document.getElementById(this.id.toString())
        const altDropZone = document.getElementById(`alt-${this.id}`)
        if (mainDropZone.contains(e.target as Node) || altDropZone.contains(e.target as Node)) {
            if (this.isFileExist()) return
            if (mainDropZone.contains(e.target as Node)) {
                if (this.isToManyFiles()) return;
                this.images.list.push(...this.selectedImagesInFolder, ...this.selectedImagesInAlts)
                this.altsImages.list = this.altsImages.list.filter(({isSelected}) => !isSelected)
            }
            if (altDropZone.contains(e.target as Node)) {
                this.altsImages.list.push(...this.selectedImagesInFolder, ...this.selectedImagesInMain)
                this.images.list = this.images.list.filter(({isSelected}) => !isSelected)
            }
        } else {
            if (this.altsImages.dragMode)
                this.altsImages.list = this.altsImages.list.filter(({
                                                                        isSelected
                                                                    }) => !isSelected)
            this.altsImages.list.forEach(item =>
                item.isSelected = false
            )
            if (this.images.dragMode)
                this.images.list = this.images.list.filter(({
                                                                isSelected
                                                            }) => !isSelected)
            this.images.list.forEach(item =>
                item.isSelected = false
            )
        }
        // if (!altDropZone.contains(e.target as Node)) {
        //     const deleteSelected = () => {
        //         if (this.altsImages.dragMode)
        //             this.altsImages.list = this.altsImages.list.filter(({
        //                                                                     isSelected
        //                                                                 }) => !isSelected)
        //         this.altsImages.list.forEach(item => {
        //             item.isSelected = false
        //             item.isConfirmed = true
        //         })
        //     }
        //     if (mainDropZone.contains(e.target as Node)) {
        //         const isInTheRange = (this.altsImages.list.filter(({isSelected}) => isSelected).length + this.images.list.length <= this.photography.maxShots) &&
        //             (imagesInFolder.list.filter(({isSelected}) => isSelected).length + this.images.list.length <= this.photography.maxShots)
        //         const isFileExist = !!this.images.list.find(item => !!this.altsImages.list.filter(({
        //                                                                                                isSelected,
        //                                                                                                name
        //                                                                                            }) => this.altsImages.dragMode && isSelected && item.name === name).length)
        //         if (isFileExist) return;
        //         isInTheRange ? deleteSelected() : this.setErrorMessage("many")
        //         return
        //     }
        //     deleteSelected()
        // }
        // if (!mainDropZone.contains(e.target as Node)) {
        //     const deleteSelected = () => {
        //         if (this.images.dragMode)
        //             this.images.list = this.images.list.filter(({
        //                                                             isSelected
        //                                                         }) => !isSelected)
        //         this.images.list.forEach(item => {
        //             item.isSelected = false
        //             item.isConfirmed = true
        //         })
        //     }
        //     if (altDropZone.contains(e.target as Node)) {
        //         const isFileExist = !!this.altsImages.list.find(item => !!this.images.list.filter(({
        //                                                                                                isSelected,
        //                                                                                                name
        //                                                                                            }) => this.images.dragMode && isSelected && item.name === name).length)
        //         !isFileExist ? deleteSelected() : this.setErrorMessage("exist")
        //         return;
        //     }
        //     deleteSelected()
        // }
        window.onmouseup = null
    }

    mouseenterMainZoneHandler(e: MouseEvent) {
        e.preventDefault()
        if (this.isDisabledDragMode) return
        window.onmouseup = this.globalMouseupHandler.bind(this)
    }

    mouseleaveMainZoneHandler(e: MouseEvent) {
        e.preventDefault()
        if (this.images.dragMode || imagesInFolder.dragMode) {
            window.onmouseup = this.globalMouseupHandler.bind(this)
        }
    }

    mouseenterAltZoneHandler(e: MouseEvent) {
        e.preventDefault()
        if (this.isDisabledDragMode) return
        window.onmouseup = this.globalMouseupHandler.bind(this)
    }

    mouseleaveAltZoneHandler(e: MouseEvent) {
        e.preventDefault()
        if (this.altsImages.dragMode || imagesInFolder.dragMode) {
            window.onmouseup = this.globalMouseupHandler.bind(this)
        }
    }

    resetSelect() {
        this.images?.list.forEach(item => item.isSelected = false)
        this.altsImages?.list.forEach(item => item.isSelected = false)
    }
}