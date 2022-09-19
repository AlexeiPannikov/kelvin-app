import {ProductionType} from "../../ProductionType";
import {Position} from "../../requests/StyleGuides/Position";
import {Asset} from "../../requests/StyleGuides/Asset";
import {Step} from "../Products/Step";
import {FileDataModel} from "../Files/FileDataModel";
import {ProductModel} from "../Products/ProductModel";
import {Task} from "./Task";
import {RejectRequest} from "../../requests/Tasks/RejectRequest";
import {RejectedFile} from "../../requests/Tasks/RejectedFile";

interface IProduction {
    production_type: ProductionType
    positions: { position: Position, assets: Asset }[],
    steps: Step[]
}

export class GetTaskResponse {
    task = new Task()
    product = new ProductModel()
    production: IProduction = {production_type: new ProductionType(), positions: [], steps: []}

    constructor(obj?: Partial<GetTaskResponse>) {
        if (obj) {
            Object.assign(this, obj)
            if (obj.task)
                this.task = new Task(obj.task)
            if (obj.product)
                this.product = new ProductModel(obj.product)
            if (obj.production) {
                if (obj.production.production_type)
                    this.production.production_type = new ProductionType(obj.production.production_type)
                if (obj.production.positions) {
                    this.production.positions = obj.production.positions.map(({position, assets}) =>
                        ({
                            assets: new Asset(assets),
                            position: new Position(position)
                        })
                    )
                }
                if (obj.production.steps)
                    this.production.steps = obj.production.steps.map(item => new Step(item))
            }
        }
    }

    get allAssets() {
        return this.production.positions.map(({assets}) => assets)
    }

    get allFilesInAssets() {
        return [...this.allAssets.map(({fileList}) => fileList).flat(), ...this.allAssets.map(({rejectedImages}) => rejectedImages).flat()]
    }

    get rejectedFiles() {
        return this.allAssets.map(({files_rejected}) => files_rejected).flat()
    }

    get rejectedImages() {
        return this.allAssets.map(({rejectedImages}) => rejectedImages).flat()
    }

    get files() {
        return this.allAssets.map(({fileList}) => fileList).flat()
    }

    get dataToReject() {
        return this.allAssets.map(({shooting_type_id, position_id, fileList}) => new RejectRequest({
            shooting_type_id,
            position_id,
            files_rejected: fileList.map(file => new RejectedFile({
                fileOriginal: new FileDataModel(file),
                file_original_uuid: file.uuid
            }))
        }))
    }
}