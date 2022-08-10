import { ProductStatusEnum } from "@api/models/requests/Products/ProductStatusEnum";
import { PropertyModel } from "@api/models/responses/Properties/PropertyModel";

export class EditProductSettingsModel {
  status: ProductStatusEnum = null;
  properties: PropertyModel[] = new Array<PropertyModel>();
  styleGuideUuid: string = null

  constructor(obj?: Partial<EditProductSettingsModel>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
