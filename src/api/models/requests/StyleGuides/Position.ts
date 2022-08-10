import {Asset} from "./Asset";
import {FileDataModel} from "../../responses/Files/FileDataModel";

export class Position {
    id = Number(Math.random().toFixed(3)) * 100
    fileIds: string[] = []
    filesInner: FileDataModel[] = []
    name = ""
    description = ""
    is_bypass_external_post_production = false
    is_color_reference = false
    is_enforce_alts = false
    is_hero = false
    is_optional = false
    is_photo_review = false
    min_shots_alts = 0
    coverFile: FileDataModel = new FileDataModel();
    cover_file_uuid: string;
    photography = {
        maxShots: 2,
        minShots: 1
    };
    asset: Asset = new Asset()

    constructor(obj?: Partial<Position>) {
        if (obj) {
            Object.assign(this, obj)
            if (!obj.asset) {
                this.asset = new Asset()
            }
        }
        this.coverFile.uuid = this.cover_file_uuid
        this.filesInner = this.fileIds.map(uuid => new FileDataModel({uuid}))
    }
}