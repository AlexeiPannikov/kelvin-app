import {Transfer} from "../../../src/store/models/Transfer";
import {app} from "electron";
import fs from "fs";
import isImage from "is-image"
import {join} from "path";
import {promisify} from "util";

const readdirAsync = promisify(fs.readdir)
const readFileAsync = promisify(fs.readFile)
const mkdirAsync = promisify(fs.mkdir)
const copyFileAsync = promisify(fs.copyFile)
const writeFileAsync = promisify(fs.writeFile)
const statAsync = promisify(fs.stat)
const rmdirAsync = promisify(fs.rmdir)
const rmAsync = promisify(fs.rm)

export class TransferHistory {

    historyList = new Array<Transfer>()
    private directory = ""

    constructor(userId: string | number) {
        this.init(userId)
    }

    private init(userId: string | number) {
        const userDirectory = join(app.getPath("userData"), `user.${userId}`)
        if (!fs.existsSync(userDirectory)) {
            fs.mkdirSync(userDirectory)
        }
        this.directory = join(userDirectory, "transfers")
        if (!fs.existsSync(this.directory)) {
            fs.mkdirSync(this.directory)
        }
    }

    async getAllTransfers() {
        const files = await readdirAsync(this.directory, {withFileTypes: true})
        this.historyList.splice(0)
        const getTransfers = async (items: fs.Dirent[], intermediatePath: string = "") => {
            for (const file of items) {
                const filePath = join(this.directory, intermediatePath, file.name)
                if (file.isFile() && !isImage(filePath)) {
                    const notParsedTransfer = await readFileAsync(filePath, {encoding: "utf8"})
                    const parsedTransferFile: Transfer = JSON.parse(notParsedTransfer)
                    this.historyList.push(new Transfer(parsedTransferFile))
                }
                if (file.isDirectory()) {
                    const filePath = join(this.directory, file.name)
                    const innerFiles = await readdirAsync(filePath, {withFileTypes: true})
                    await getTransfers(innerFiles, file.name)
                }
            }
        }
        await getTransfers(files)
        return this.historyList
    }

    async save(list: Transfer[]) {
        for (const transfer of list) {
            const transferDir = join(this.directory, transfer.uuid)
            await mkdirAsync(transferDir)
            for (const file of transfer.allImages) {
                const newFilePath = join(transferDir, file.name)
                await copyFileAsync(file.path, newFilePath)
                file.path = newFilePath
            }
            await writeFileAsync(`${join(transferDir, transfer.uuid)}.txt`, JSON.stringify(transfer), {encoding: "utf8"})
        }
        this.historyList.push(...list)
        return this
    }

    async delete(uuid: string) {
        this.historyList = this.historyList.filter(item => item.uuid !== uuid)
        const clearDirectory = async (dirPath: string) => {
            const files = await readdirAsync(dirPath)
            for (const file of files) {
                const filePath = join(dirPath, file)
                const stat = await statAsync(filePath)
                if (stat.isFile())
                    await rmAsync(filePath)
                if (stat.isDirectory())
                    await clearDirectory(filePath)
            }
        }
        const rootDir = join(this.directory, uuid)
        await clearDirectory(rootDir)
        await rmdirAsync(rootDir)
        return this
    }
}