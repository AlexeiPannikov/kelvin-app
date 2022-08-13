import {Option} from "./Option";

export class EditPropertyRequest {
  type: string = "";
  name: string = "";
  internal_name: string = "";
  options = new Array<Option>()

  constructor(obj?: Partial<EditPropertyRequest>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
