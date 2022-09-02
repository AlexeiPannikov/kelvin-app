import {ImageModel} from "../../view/pages/capture/components/files-view/ImageModel";

export class TransferPosition {
    id = ""
    files = new Array<ImageModel>()

    constructor(obj?: Partial<TransferPosition>) {
        if (obj)
            Object.assign(this, obj)
    }
}