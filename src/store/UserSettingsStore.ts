import {defineStore} from "pinia";
import {PrimarySettings} from "./models/PrimarySettings";
import {ipcRenderer, FileFilter} from "electron";
import fs from "fs";
import {useCurrentUserStore} from "./CurrentUserStore";
import {OpenDialogReturnValue} from "electron"
import isImage from "is-image"
import {join, parse, extname, normalize} from "path";
import {promisify} from "util";

export const useUserSettingsStore = defineStore("user-settings", {
    state: () => {
        return {
            primarySettings: new PrimarySettings(),
            isValidPhotoshopPath: true,
            isValidBridgePath: true,
        };
    },

    getters: {},

    actions: {
        async selectDirectory() {
            const dialogRes: OpenDialogReturnValue = await ipcRenderer.invoke("open-set-directory-dialog")
            if (dialogRes)
                return dialogRes.filePaths[0]
        },

        async selectFile(filters?: FileFilter[]) {
            const dialogRes: OpenDialogReturnValue = await ipcRenderer.invoke("open-set-filter-dialog", JSON.parse(JSON.stringify(filters)))
            if (dialogRes)
                return dialogRes.filePaths[0]
        },

        async getSettings() {
            const currentUserStore = useCurrentUserStore()
            this.primarySettings = await ipcRenderer.invoke("get-user-settings", currentUserStore.currentUser.id)
        },

         saveSettings() {
            const currentUserStore = useCurrentUserStore()
            ipcRenderer.send("set-user-settings", currentUserStore.currentUser.id, JSON.parse(JSON.stringify(this.primarySettings)))
        },
    },
});
