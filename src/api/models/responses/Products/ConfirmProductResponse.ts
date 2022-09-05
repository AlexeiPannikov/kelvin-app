import {ProductionType} from "../../ProductionType";
import {Position} from "../../requests/StyleGuides/Position";

export class ConfirmProductResponse {
    production_type = new ProductionType()
    positions = new Array<Position>()
    task_uuid = ""

    get allCovers() {
        return this.positions.map(item => (item.coverFile))
    }

    constructor(obj: ConfirmProductResponse) {
        Object.assign(this, obj)
        this.positions = obj.positions.map(item => new Position(item))
    }
}