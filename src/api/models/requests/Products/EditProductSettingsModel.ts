import {PropertyModel} from "../../responses/Properties/PropertyModel";
import {ProductStatusEnum} from "./ProductStatusEnum";

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
