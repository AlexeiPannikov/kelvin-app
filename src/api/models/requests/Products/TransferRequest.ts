import {PositionRequestModel} from "../../responses/Products/PositionRequestModel";
import {TeamOnSetRequestModel} from "./TeamOnSetRequestModel";

export class TransferRequest {
    task_uuid = ""
    teamOnSet = new Array<TeamOnSetRequestModel>()
    positions = new Array<PositionRequestModel>
}