import { NotificationTypesEnum } from "./NotificationTypesEnum";
import {Options} from "./Options";

export class NotificationModel {
  readonly id: symbol = Symbol("id");
  message: string = "";
  type: NotificationTypesEnum = NotificationTypesEnum.Message;
  options: Options = new Options();
  container: string = "1";

  constructor(obj?: Partial<NotificationModel>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
