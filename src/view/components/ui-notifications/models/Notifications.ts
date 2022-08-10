import { NotificationTypesEnum } from "./NotificationTypesEnum";
import { NotificationModel } from "./NotificationModel";
import { reactive } from "vue";
import {Options} from "./Options";

class Notifications {
  notificationList: NotificationModel[] = [];

  get sortedListByContainer() {
    const sortedList = new Map<string, NotificationModel[]>();
    const containers = new Set(
      this.notificationList.map(({ container }) => container)
    );
    containers.forEach((container) => {
      sortedList.set(
        container,
        this.notificationList.filter((item) => item.container === container)
      );
    });
    return sortedList;
  }

  newMessage(
    message: string,
    options: Options = new Options(),
    container: string = "1"
  ) {
    this.notificationList.push(
      new NotificationModel({
        message,
        type: NotificationTypesEnum.Message,
        options: new Options(options),
        container,
      })
    );
    console.log(this.notificationList);
    console.log(this.sortedListByContainer);
  }

  newWarning(message: string, container: string = "1") {
    this.notificationList.push(
      new NotificationModel({ message, type: NotificationTypesEnum.Warning })
    );
  }

  removeNotification(id: symbol) {
    this.notificationList = this.notificationList.filter(
      (item) => item.id !== id
    );
  }

  constructor(obj?: Partial<Notifications>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}

export default reactive(new Notifications());
