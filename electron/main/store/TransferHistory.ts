import {Transfer} from "../../../src/store/models/Transfer";
import {app} from "electron";
import fs from "fs";
import isImage from "is-image"
import path from "path";

export class TransferHistory {

    historyList = new Array<Transfer>()
    private directory = ""

    constructor(userId: string | number) {
        const userDirectory = path.join(app.getPath("userData"), `user.${userId}`)
        if (!fs.existsSync(userDirectory)) {
            fs.mkdirSync(userDirectory)
        }
        this.directory = path.join(userDirectory, "transfers")
        if (!fs.existsSync(this.directory)) {
            fs.mkdirSync(this.directory)
        }
    }

    getAllTransfers() {
        const files = fs.readdirSync(this.directory, {withFileTypes: true})
        this.historyList.splice(0)
        const getTransfers = (items: fs.Dirent[], intermediatePath: string = "") => {
            for (const file of items) {
                const filePath = path.join(this.directory, intermediatePath, file.name)
                if (file.isFile() && !isImage(filePath)) {
                    const parsedTransferFile: Transfer = JSON.parse(fs.readFileSync(filePath).toString())
                    this.historyList.push(new Transfer(parsedTransferFile))
                }
                if (file.isDirectory()) {
                    const filePath = path.join(this.directory, file.name)
                    const innerFiles = fs.readdirSync(filePath, {withFileTypes: true})
                    getTransfers(innerFiles, file.name)
                }
            }
        }
        getTransfers(files)
        return this.historyList
    }

    save(list: Transfer[]) {
        list.forEach(transfer => {
            const transferDir = path.join(this.directory, transfer.uuid)
            fs.mkdirSync(transferDir)
            transfer.files.forEach(file => {
                const newFilePath = path.join(transferDir, file.name)
                fs.copyFileSync(file.path, newFilePath)
                file.path = newFilePath
            })
            fs.writeFileSync(`${path.join(transferDir, transfer.uuid)}.txt`, JSON.stringify(transfer))
        })
        this.historyList.push(...list)
        return this
    }

    delete(uuid: string) {
        this.historyList = this.historyList.filter(item => item.uuid !== uuid)
        const clearDirectory = (dirPath: string) => {
            const files = fs.readdirSync(dirPath)
            for (const file of files) {
                const filePath = path.join(dirPath, file)
                const stat = fs.statSync(filePath)
                if (stat.isFile())
                    fs.rmSync(filePath)
                if (stat.isDirectory())
                    clearDirectory(filePath)
            }
        }
        const rootDir = path.join(this.directory, uuid)
        clearDirectory(rootDir)
        fs.rmdirSync(rootDir)
        return this
    }
}