import {v4} from "uuid";
import {ImageModel} from "../../view/pages/capture/components/files-view/ImageModel";

export class Transfer {

    readonly uuid = v4()
    productCode: string = null
    productionTypeName: string = null
    files = new Array<ImageModel>()
    date: Date = null
    uploading = false
    uploadSuccessfully = false

    startUpload() {
        this.uploading = true
        this.uploadSuccessfully = false
    }

    uploadSuccess() {
        this.uploading = false
        this.uploadSuccessfully = true
    }

    uploadError() {
        this.uploading = false
        this.uploadSuccessfully = false
    }

    constructor(obj?: Partial<Transfer>) {
        if (obj) Object.assign(this, obj)
    }
}