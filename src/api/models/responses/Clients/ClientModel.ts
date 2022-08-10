import {FileDataModel} from "../Files/FileDataModel";

export class ClientModel {
  created_at: string = "";
  id: number = null;
  is_enabled = 0;
  name: string = "";
  studio_id: number = null;
  updated_at: string = "";
  avatar_file_id: number = null;
  avatar_uuid = "";
  avatar = new FileDataModel()
  timezone = "";

  constructor(obj?: Partial<ClientModel>) {
    if (obj) {
      Object.assign(this, obj);
      this.avatar.uuid = this.avatar_uuid
      this.avatar.id = this.id
    }
  }
}
