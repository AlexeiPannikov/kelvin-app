import {FileDataModel} from "../../responses/Files/FileDataModel";

export class RejectedFile {
    file_original_uuid = ""
    fileOriginal = new FileDataModel()
    file_edited_uuid: string = null
    fileEdited = new FileDataModel()
    reason = ""

    get requestData() {
        return {
            file_original_uuid: this.file_original_uuid,
            file_edited_uuid: this.file_edited_uuid,
            reason: this.reason
        }
    }

    get allImages() {
        return [this.fileOriginal, this.fileEdited]
    }

    constructor(obj?: Partial<RejectedFile>) {
        if (obj) {
            Object.assign(this, obj)
            if (obj.fileOriginal)
                this.fileOriginal = new FileDataModel(obj.fileOriginal)
            else this.fileOriginal = new FileDataModel({uuid: this.file_original_uuid})
            if (obj.fileEdited)
                this.fileEdited = new FileDataModel(obj.fileEdited)
            else this.fileEdited = new FileDataModel({uuid: this.file_edited_uuid})
        }
    }
}