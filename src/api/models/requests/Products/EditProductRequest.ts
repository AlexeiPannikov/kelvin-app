import {ProductStatusEnum} from "./ProductStatusEnum";

export class EditProductRequest {
  status: ProductStatusEnum = null;
  is_active: boolean = true;
  styleguide_uuid: string = null;
  properties: { property_id: number; value: string | number }[] = new Array<{
    property_id: number;
    value: string | number;
  }>();

  constructor(obj?: Partial<EditProductRequest>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
