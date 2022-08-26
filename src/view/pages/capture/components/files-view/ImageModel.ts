import {Coordinates} from "vue-advanced-cropper";
import {v4 as uuidv4} from "uuid"

export class ImageModel {
    path = ""
    name = ""
    image: File = null
    isSelected = false
    isConfirmed = false
    cropImage: any = null
    cropCoords: Coordinates = <Coordinates>{}

    constructor(obj?: Partial<ImageModel>) {
        if (obj)
            Object.assign(this, obj)
    }
}