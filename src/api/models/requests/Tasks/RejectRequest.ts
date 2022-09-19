import {RejectedFile} from "./RejectedFile";

export class RejectRequest {
    position_id: number = null
    shooting_type_id: number = null
    files_rejected: RejectedFile[] = []

    get editedFiles() {
        return this.files_rejected.map(({fileEdited}) => fileEdited)
    }

    constructor(obj?: Partial<RejectRequest>) {
        if (obj) {
            Object.assign(this, obj)
            this.files_rejected = obj.files_rejected.map(item => new RejectedFile(item))
        }
    }
}