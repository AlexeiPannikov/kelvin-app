import Store, {Options} from "electron-store"
import {PrimarySettings} from "../../../src/store/models/PrimarySettings";
import {app} from "electron"
import * as fs from "fs";

export class UserSettingsStore extends Store {
    data: PrimarySettings = new PrimarySettings()

    constructor(userId: string | number, settings?: Options<any>) {
        const userDirectory = app.getPath("userData") + `/user.${userId}`
        if (!fs.existsSync(userDirectory)) {
            fs.mkdirSync(userDirectory)
        }
        super({name: ` user.${userId}-settings`, cwd: userDirectory, ...settings});
        this.data = this.get("data") as PrimarySettings || new PrimarySettings()
    }

    getAllSettings() {
        this.data = this.get("data") as PrimarySettings || new PrimarySettings()
        return this
    }

    getSetting(property: string) {
        return this.get(property)
    }

    saveSettings(data: PrimarySettings) {
        this.set({data: {...this.data, ...data}})
        return this
    }
}