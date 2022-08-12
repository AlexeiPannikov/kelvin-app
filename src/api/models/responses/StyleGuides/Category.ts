
export class Category {
  id: number = null;
  client_id: number = null;
  name = "";
  uuid = "";

  constructor(obj?: Partial<Category>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
