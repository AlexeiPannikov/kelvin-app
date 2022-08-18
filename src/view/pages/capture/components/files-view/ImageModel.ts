import {Coordinates} from "vue-advanced-cropper";

export class ImageModel {
    id = Number(Math.random().toFixed(3)) * 100
    path = ""
    name = ""
    isSelected = false
    cropImage: any = null
    cropCoords: Coordinates = <Coordinates>{}

    constructor(obj?: Partial<ImageModel>) {
        if (obj)
            Object.assign(this, obj)
    }
}