import {Coordinates} from "vue-advanced-cropper";

export class FileModel {
    path = ""
    name = ""
    isSelected = false
    cropImage: any = null
    cropCoords: Coordinates = <Coordinates>{}

    constructor(obj?: Partial<FileModel>) {
        if (obj)
            Object.assign(this, obj)
    }
}