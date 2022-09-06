import {ProductionType} from "../../ProductionType";
import {Position} from "../../requests/StyleGuides/Position";
import {Task} from "./Task";

export class GetProductProductionsResponse {
    production_type = new ProductionType()
    positions = new Array<Position>()
    task = new Task()
}