import {EditProductSettingsModel} from "./EditProductSettingsModel";
import {PropertyModel} from "../../responses/Properties/PropertyModel";

export class EditProductDataModel {
  isActive: boolean = true;
  settings: EditProductSettingsModel = new EditProductSettingsModel();
  properties: PropertyModel[] = new Array<PropertyModel>();

  constructor(obj?: Partial<EditProductDataModel>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
