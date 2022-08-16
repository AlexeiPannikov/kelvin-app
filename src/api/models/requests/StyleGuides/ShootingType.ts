import {Position} from "./Position";
import {FileDataModel} from "../../responses/Files/FileDataModel";

export class ShootingType {
    description = ""
    production_type_uuid = ""
    fileIds: string[] = []
    filesInner: FileDataModel[] = []
    positions = new Array<Position>()

    constructor(obj?: Partial<ShootingType>) {
        if (obj) {
            Object.assign(this, obj)
        }
        this.filesInner = this.fileIds.map(uuid => new FileDataModel({uuid}))
        this.positions = obj.positions.map(item => new Position(item))
    }

}