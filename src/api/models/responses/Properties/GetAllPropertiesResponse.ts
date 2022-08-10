import {EntityModel} from "@api/models/responses/Properties/EntityModel";
import {PropertyModel} from "@api/models/responses/Properties/PropertyModel";

export class GetAllPropertiesResponse {
    entity = new EntityModel()
    properties = new Array<PropertyModel>()

    constructor(obj?: Partial<GetAllPropertiesResponse>) {
        if (obj) {
            Object.assign(this, obj)
            this.entity = new EntityModel(obj.entity)
            this.properties = obj.properties.map((item) => new PropertyModel(item))
        }
    }
}