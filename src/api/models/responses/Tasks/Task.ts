import {FileDataModel} from "../Files/FileDataModel";
import {StepEnum} from "../../StepEnum";


export class Task {
    task_id: number = null
    id: number = null
    code = ""
    name = ""
    is_picked = 0
    is_rejected = 0
    worker_name: string = null
    worker_id: number = null
    task_uuid = ""
    uuid = ""
    shooting_type_id: number = null
    step: StepEnum = null
    styleguide_version_id: number = null
    styleguide_name = ""
    styleguide_uuid = ""
    cover_file_uuid = ""
    product_uuid = ""
    uploads_files_uuid: string[] = []
    uploadFiles: FileDataModel[] = []
    isSelected = false

    constructor(obj?: Partial<Task>) {
        if (obj) {
            Object.assign(this, obj)
        }
        if (this.uploads_files_uuid) {
            this.uploadFiles = this.uploads_files_uuid.map(uuid => new FileDataModel({uuid}))
        }
    }
}