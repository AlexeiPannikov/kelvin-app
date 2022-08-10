import {Option} from "@api/models/requests/Properties/Option";

export class AddPropertyRequest {
  entity_id: number = null;
  type: string = "";
  name: string = "";
  internal_name: string = "";
  options = new Array<Option>()

  constructor(obj?: Partial<AddPropertyRequest>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
