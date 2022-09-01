import {ProductionType} from "../../ProductionType";
import {Position} from "../../requests/StyleGuides/Position";

export class BeginTransferResponse {
    production_type = new ProductionType()
    positions = new Array<Position>()
    task_uuid = ""
}