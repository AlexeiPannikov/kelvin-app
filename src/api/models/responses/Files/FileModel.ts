export class FileModel {
  uuid = "";
  url = "";
  original_name = ""

  constructor(obj?: Partial<FileModel>) {
    if (obj) {
      Object.assign(this, obj)
    }
  }
}
