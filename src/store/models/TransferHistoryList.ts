import {Transfer} from "./Transfer";

export class TransferHistoryList {

    historyList = new Array<Transfer>()
    itemsToTransfer = new Array<Transfer>()

    startUpload() {
        this.itemsToTransfer.forEach(item => item.startUpload())
    }

    successUpload() {
        this.itemsToTransfer.forEach(item => item.uploadSuccess())
    }

    errorUpload() {
        this.itemsToTransfer.forEach(item => item.uploadError())
    }

    constructor(obj?: Partial<TransferHistoryList>) {
        if (obj) Object.assign(this, obj)
    }
}