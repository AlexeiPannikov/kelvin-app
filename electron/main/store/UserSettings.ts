import Store, {Options} from "electron-store"
import {PrimarySettings} from "../../../src/view/pages/auth/models/PrimarySettings";

const store = new Store({})

export class UserSettingsStore extends Store {
    data: PrimarySettings | any = new PrimarySettings()

    constructor(settings?: Options<any>) {
        super({name: "user-settings", ...settings});
        this.data = this.get("user-settings") || new PrimarySettings()
    }

    getSettings() {
        return this.get("data") || new PrimarySettings()
    }

    saveSettings(data: PrimarySettings) {
        this.set({data: {...data}})
        return this
    }
}