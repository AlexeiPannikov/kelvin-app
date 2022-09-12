import {defineStore} from "pinia";
import {extname, join, normalize, parse} from "path";
import fs from "fs";
import {promisify} from "util";
import {useUserSettingsStore} from "./UserSettingsStore";
import images from "../view/pages/capture/components/files-view/ImagesList";
import {ImageModel} from "../view/pages/capture/components/files-view/ImageModel";

interface IState {
    size: number,
    rootFolder: string,
    newRootFolder: string,
    selectedFolder: string,
    selectedWithoutEndpoint: string,
    endpoint: string,
}

export interface IFolder {
    id?: number,
    name: string,
    path: string,
    children: IFolder[]
}

export const useFilesViewStore = defineStore("files-view", {
    state: () => {
        return <IState>{
            size: Number(window.localStorage.getItem("image_size")) || 200,
            rootFolder: "",
            newRootFolder: "",
            selectedFolder: "",
            selectedWithoutEndpoint: "",
            endpoint: "",
        };
    },

    actions: {
        async getRootFolder() {
            const userSettingsStore = useUserSettingsStore()
            await userSettingsStore.getSettings()
            const folder = userSettingsStore.primarySettings.folder
            const lastOpenedFolder = userSettingsStore.primarySettings.lastOpenedFolder
            if (fs.existsSync(lastOpenedFolder)) {
                this.selectedFolder = lastOpenedFolder
            } else {
                this.selectedFolder = folder
            }
            this.rootFolder = folder
            this.parseFolder()
        },

        parseFolder() {
            const parsedFolder = parse(this.selectedFolder)
            this.endpoint = parsedFolder.base
            this.selectedWithoutEndpoint = parsedFolder.dir
        },

        async getFilesInFolder() {
            await this.getRootFolder()
            if (!fs.existsSync(this.selectedFolder || this.rootFolder)) return
            const list: { name: string, path: string, file: File }[] = []
            const getFiles = async () => {
                const innerFolder = this.selectedFolder || this.rootFolder
                if (!fs.existsSync(innerFolder)) return
                const readdirAsync = promisify(fs.readdir)
                const allFiles = await readdirAsync(innerFolder, {withFileTypes: true})
                for (const file of allFiles) {
                    if (file.isFile()) {
                        const filePath = normalize(join(innerFolder, file.name))
                        const extension = extname(file.name).substring(1, file.name.length - 1)
                        const imageFile = await fetch(filePath).then(r => r.blob())
                            .then(blob => new File([blob], file.name, {type: `image/${extension}`}));
                        list.push({
                            name: file.name,
                            path: filePath,
                            file: imageFile
                        })
                    }
                }
            }
            await getFiles()
            return list
        },

        async initFilesInFolder() {
            const list = await this.getFilesInFolder()
            images.list.splice(0)
            if (list)
                images.list = list.map(({file, name, path}) => new ImageModel({
                    path,
                    name,
                    image: file
                }))
            fs.watch(this.selectedFolder || this.rootFolder, async () => {
                images.list.splice(0)
                await this.initFilesInFolder()
            })
        },

        async getFoldersTree(rootPath: string): Promise<IFolder> {
            await this.getRootFolder()
            const parsedPath = parse(this.rootFolder)
            const mainFolder: IFolder = {name: parsedPath.base, path: this.rootFolder, children: []}
            const getFiles = async (path: string, folders: IFolder[]) => {
                if (!folders) return
                const foundedFolder = folders.find((item) => item.path === path)
                foundedFolder?.children.splice(0)
                const readdirAsync = promisify(fs.readdir)
                const itemsInRootPath = await readdirAsync(path, {withFileTypes: true})
                for (const i in itemsInRootPath) {
                    if (itemsInRootPath[i].isDirectory()) {
                        const normPath = normalize(join(path, itemsInRootPath[i].name))
                        const newFolder = <IFolder>{name: itemsInRootPath[i].name, path: normPath, children: []}
                        folders.push(newFolder)
                        const itemsInPath = await readdirAsync(normPath, {withFileTypes: true})
                        if (itemsInPath?.length) {
                            for (const childItem of itemsInPath) {
                                console.log(childItem)
                                await getFiles(normPath, newFolder.children)
                            }
                        }
                    }
                }
            }
            await getFiles(rootPath, mainFolder.children)
            fs.watch(rootPath, async () => await this.getFoldersTree(rootPath))
            return mainFolder
        },

        saveInLocalStorage() {
            window.localStorage.setItem("image_size", this.size.toString())
        },
    },
})
