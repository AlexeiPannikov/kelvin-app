import PropertiesService from "../../api/services/PropertiesService";
import {EntityEnum} from "../../api/models/responses/Properties/EntityEnum";
import {PropertyModel} from "../../api/models/responses/Properties/PropertyModel";
import {EntityModel} from "../../api/models/responses/Properties/EntityModel";

export const getProperties = async (entityId: EntityEnum): Promise<[PropertyModel[], EntityModel[]]> => {
    let properties: PropertyModel[] = []
    let entities: EntityModel[] = []
    try {
        const res = await PropertiesService.getProperties(entityId);
        if (res) {
            properties = res.properties
            entities = res.entities
        }
    } catch (e) {
        console.log(e)
    }
    return [properties, entities]
}