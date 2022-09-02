import {v4} from "uuid";
import {ImageModel} from "../../view/pages/capture/components/files-view/ImageModel";
import {TransferPosition} from "./TransferPosition";

export class Transfer {

    readonly uuid = v4()
    productCode: string = null
    productionTypeName: string = null
    productionTypeUuid: string = null
    taskUuid: string = null
    positions = new Array<TransferPosition>()
    date: string = null
    uploading = false
    uploadSuccessfully = false

    get allImages() {
        return this.positions.map(({files}) => files).flat()
    }

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

    stopUpload() {
        this.uploading = false
    }

    constructor(obj?: Partial<Transfer>) {
        if (obj) Object.assign(this, obj)
    }
}