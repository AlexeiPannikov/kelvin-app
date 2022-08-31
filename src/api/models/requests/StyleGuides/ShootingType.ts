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

    get isValidNumberOfPictures() {
        return !this.positions.find(({isValidNumberOfPictures}) => !isValidNumberOfPictures)
    }

    private keydownHandler(e: KeyboardEvent) {
        if (e.key === "Delete" || e.key === "Backspace")
            this.positions.forEach(item => item.pressDeleteHandler.call(item))
    }

    subscribes() {
        window.onkeydown = this.keydownHandler.bind(this)
    }

    unsubscribes() {
        window.onkeydown = null
    }
}