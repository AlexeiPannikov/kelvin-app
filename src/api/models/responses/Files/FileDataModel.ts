export class FileDataModel {
    url = "";
    file: File = null;
    id = Number(Math.random().toFixed(2)) * 100;
    original_name = "";
    uuid = "";

    constructor(obj?: Partial<FileDataModel>) {
        if (obj) {
            Object.assign(this, obj)
        }
    }

}
