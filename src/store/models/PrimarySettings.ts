export class PrimarySettings {
    folder = ""
    transferHistory = 7
    adobeApplications = {
        ps: "",
        br: ""
    }
    lastOpenedFolder = ""

    constructor(obj?: Partial<PrimarySettings>) {
        if (obj) {
            Object.assign(this, obj)
        }
    }
}