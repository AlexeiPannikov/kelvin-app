import {FileDataModel} from "../../responses/Files/FileDataModel";
import {RejectedFile} from "../Tasks/RejectedFile";

export class Asset {
    id: number = null;
    output_name = "";
    task_id: number = null
    product_id: number = null
    shooting_type_id: number = null
    position_id: number = null
    files: string[] = []
    fileList: FileDataModel[] = []
    files_rejected: RejectedFile[] = []
    preset_uuid: string = null;
    preset: boolean = null;
    preset_id: number = null;
    outputList: string[] = [];

    constructor(obj?: Partial<Asset>) {
        if (obj) {
            Object.assign(this, obj);
            this.fileList = this.files.map((uuid) => new FileDataModel({uuid}));
            if (obj.files_rejected) {
                this.files_rejected = obj.files_rejected.map(item => new RejectedFile(item))
            }
        }
    }

    get rejectedImages() {
        return this.files_rejected.map(item => item.allImages).flat()
    }
}
