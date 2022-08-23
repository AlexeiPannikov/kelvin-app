import {defineStore} from "pinia";
import {PrimarySettings} from "./models/PrimarySettings";
import {ipcRenderer} from "electron";
import fs from "fs";
import nodePath from "path";
import {useCurrentUserStore} from "./CurrentUserStore";
import {OpenDialogReturnValue} from "electron"

export interface IFolder {
    name: string,
    path: string,
    children: IFolder[]
}

export const useUserSettingsStore = defineStore("user-settings", {
    state: () => {
        return {
            primarySettings: new PrimarySettings(),
            rootFolder: "",
            selectedFolder: "",
            selectedWithoutEndpoint: "",
            endpoint: "",
            firstLoading: true
        };
    },

    getters: {},

    actions: {
        async getRootFolder() {
            const currentUserStore = useCurrentUserStore()
            const settings: PrimarySettings = await ipcRenderer.invoke("get-user-settings", currentUserStore.currentUser.id)
            this.rootFolder = settings.folder
            if (this.firstLoading)
                this.selectedFolder = settings.folder
            this.parseFolder(this.selectedFolder)
            this.firstLoading = false
        },

        getEndpoint(folder: string): [string, number] {
            const index = folder.lastIndexOf("\\")
            return [folder.substring(index + 1, folder.length), index]
        },

        parseFolder(folder: string) {
            const [endpoint, index] = this.getEndpoint(this.selectedFolder)
            this.endpoint = endpoint
            this.selectedWithoutEndpoint = folder.substring(0, index)
        },

        async getFilesInFolder(callback: (args: { name: string, path: string }) => void, list?: any[]) {
            await this.getRootFolder()
            const getFiles = () => {
                const innerFolder = this.selectedFolder || this.rootFolder
                list?.splice(0)
                const allFiles = fs.readdirSync(innerFolder, {withFileTypes: true})
                for (const file of allFiles) {
                    if (file.isFile()) {
                        callback({name: file.name, path: nodePath.normalize(innerFolder) + "\\" + file.name})
                    }
                }
            }
            getFiles()
            fs.watch(this.selectedFolder || this.rootFolder, getFiles)
        },


        async getFoldersTree(rootPath: string): Promise<IFolder> {
            await this.getRootFolder()
            const [endpoint] = this.getEndpoint(this.rootFolder)
            const mainFolder: IFolder = {name: endpoint, path: this.rootFolder, children: []}
            const getFiles = async (path: string, folders: IFolder[]) => {
                if (!folders) return
                const foundedFolder = folders.find((item) => item.path === path)
                foundedFolder?.children.splice(0)
                const itemsInRootPath = fs.readdirSync(path, {withFileTypes: true})
                for (const item of itemsInRootPath) {
                    if (item.isDirectory()) {
                        const normPath = nodePath.normalize(path) + "\\" + item.name
                        folders.push(<IFolder>{name: item.name, path: normPath, children: []})
                        const itemsInPath = fs.readdirSync(normPath, {withFileTypes: true})
                        if (itemsInPath?.length) {
                            for (const child of folders) {
                                await getFiles(normPath, child.children)
                            }
                        }
                    }
                }
            }
            await getFiles(rootPath, mainFolder.children)
            fs.watch(rootPath, async () => await this.getFoldersTree(rootPath))
            return mainFolder
        },

        async selectDirectory() {
            const userSettingsStore = useUserSettingsStore()
            const dialogRes: OpenDialogReturnValue = await ipcRenderer.invoke("open-set-directory-dialog")
            if (dialogRes)
                userSettingsStore.primarySettings.folder = dialogRes.filePaths[0]
        },

        saveSettings() {
            const currentUserStore = useCurrentUserStore()
            ipcRenderer.send("set-user-settings", currentUserStore.currentUser.id, JSON.parse(JSON.stringify(this.primarySettings)))
        },
    },
});
