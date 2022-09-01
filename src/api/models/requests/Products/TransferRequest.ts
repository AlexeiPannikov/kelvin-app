import {PositionRequestModel} from "../../responses/Products/PositionRequestModel";

export class TransferRequest {
    task_uuid = ""
    positions = new Array<PositionRequestModel>
}