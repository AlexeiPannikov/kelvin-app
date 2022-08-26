import {Transfer} from "../../../src/store/models/Transfer";
import {app} from "electron";
import fs from "fs";
import isImage from "is-image"

export class TransferHistory {

    historyList = new Array<Transfer>()
    private directory = ""

    constructor(userId: string | number) {
        const userDirectory = app.getPath("userData") + `/user.${userId}`
        if (!fs.existsSync(userDirectory)) {
            fs.mkdirSync(userDirectory)
        }
        this.directory = userDirectory + "/transfers"
        if (!fs.existsSync(this.directory)) {
            fs.mkdirSync(this.directory)
        }
    }

    getAllTransfers() {
        const files = fs.readdirSync(this.directory, {withFileTypes: true})
        this.historyList.splice(0)
        const getTransfers = (items: fs.Dirent[], intermediatePath: string = "") => {
            for (const file of items) {
                const filePath = this.directory + `/${intermediatePath}` + "/" + file.name
                if (file.isFile() && !isImage(filePath)) {
                    const parsedTransferFile: Transfer = JSON.parse(fs.readFileSync(filePath).toString())
                    this.historyList.push(new Transfer(parsedTransferFile))
                }
                if (file.isDirectory()) {
                    const filePath = this.directory + "/" + file.name
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
            const transferDir = this.directory + `/${transfer.uuid}`
            fs.mkdirSync(transferDir)
            transfer.files.forEach(item => item.path = transferDir + `/${transfer.uuid}.txt`)
            fs.writeFileSync(transferDir + `/${transfer.uuid}.txt`, JSON.stringify(transfer))
            transfer.files.forEach(file => {
                fs.copyFileSync(file.path, transferDir + `/${file.name}`)
            })
        })
        this.historyList.push(...list)
        return this
    }

    delete(uuid: string) {
        this.historyList = this.historyList.filter(item => item.uuid !== uuid)
    }
}