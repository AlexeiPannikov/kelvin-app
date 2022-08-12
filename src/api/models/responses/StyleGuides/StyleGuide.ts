import {ShootingType} from "../../requests/StyleGuides/ShootingType";
import {FileDataModel} from "../Files/FileDataModel";
import {Category} from "./Category";

export class StyleGuide {
    id: number = null;
    client_id: number = null;
    workflow_id: number = null;
    workflow_uuid: string = "";
    description = "";
    cover_file_id: number = null;
    cover_file_uuid: string = null;
    files: string[] = []
    filesInner: FileDataModel[] = []
    name = "";
    internal_name = "";
    is_enabled = 0;
    uuid = "";
    coverFile: FileDataModel = new FileDataModel();
    shootingTypes = new Array<ShootingType>()
    categories: Category[] = []

    get hasRequireData() {
        return !!(
            this.name &&
            this.internal_name &&
            this.workflow_uuid &&
            this.client_id
        );
    }

    getAllFiles() {
        return [
            this.coverFile,
            ...this.filesInner,
            ...this.shootingTypes.map(({filesInner, positions}) => ([...filesInner, ...positions.map(({
                                                                                                       coverFile,
                                                                                                       filesInner: files
                                                                                                   }) => ([coverFile, ...files])).flat(1)])).flat(1),
        ]
    }

    constructor(obj?: Partial<StyleGuide>) {
        if (obj) {
            Object.assign(this, obj);
        }
        this.coverFile.uuid = this.cover_file_uuid
        this.coverFile.id = this.cover_file_id
        this.filesInner = this.files.map(uuid => new FileDataModel({uuid}))
        if(obj?.categories?.length) {
            this.categories = obj.categories.map(category => new Category(category))
        }
    }
}
