export class FileModel {
    path = ""
    name = ""
    isSelected  = false

    constructor(obj?: Partial<FileModel>) {
        if (obj)
            Object.assign(this, obj)
    }
}