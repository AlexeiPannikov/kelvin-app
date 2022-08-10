import { EntityModel } from "@api/models/responses/Properties/EntityModel";
import { PropertyModel } from "@api/models/responses/Properties/PropertyModel";

export class GetPropertiesData {
  entities: EntityModel[];
  properties: PropertyModel[];
}
