import {defineStore} from "pinia";
import {PrimarySettings} from "./models/PrimarySettings";
import {ipcRenderer, FileFilter} from "electron";
import fs from "fs";
import nodePath from "path";
import {useCurrentUserStore} from "./CurrentUserStore";
import {OpenDialogReturnValue} from "electron"
import isImage from "is-image"
import path from "path";

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
            newRootFolder: "",
            selectedFolder: "",
            selectedWithoutEndpoint: "",
            endpoint: "",
            isValidPhotoshopPath: true,
            isValidBridgePath: true,
        };
    },

    getters: {},

    actions: {
        async getRootFolder() {
            const currentUserStore = useCurrentUserStore()
            const settings: PrimarySettings = await ipcRenderer.invoke("get-user-settings", currentUserStore.currentUser.id)
            this.rootFolder = settings.folder
            this.parseFolder(this.selectedFolder)
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

        async getFilesInFolder(callback: (args: { name: string, path: string, file: File }) => void, list?: any[]) {
            await this.getRootFolder()
            if (!fs.existsSync(this.selectedFolder || this.rootFolder)) return
            const getFiles = async () => {
                const innerFolder = this.selectedFolder || this.rootFolder
                if (!fs.existsSync(innerFolder)) return
                list?.splice(0)
                const allFiles = fs.readdirSync(innerFolder, {withFileTypes: true})
                for (const file of allFiles) {
                    if (file.isFile()) {
                        const filePath = nodePath.normalize(innerFolder) + "\\" + file.name
                        const extension = path.extname(file.name).substring(1, file.name.length - 1)
                        const imageFile = await fetch(filePath).then(r => r.blob())
                            .then(blob => new File([blob], file.name, {type: `image/${extension}`}));
                        callback({
                            name: file.name,
                            path: filePath,
                            file: imageFile
                        })
                    }
                }
            }
            await getFiles()
            fs.watch(this.selectedFolder || this.rootFolder, async () => await getFiles())
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
            if (fs.existsSync(this.primarySettings.lastOpenedFolder)) {
                this.selectedFolder = this.primarySettings.lastOpenedFolder
            } else {
                this.selectedFolder = this.primarySettings.folder
            }
        },

        saveSettings() {
            const currentUserStore = useCurrentUserStore()
            ipcRenderer.send("set-user-settings", currentUserStore.currentUser.id, JSON.parse(JSON.stringify(this.primarySettings)))
        },
    },
});
