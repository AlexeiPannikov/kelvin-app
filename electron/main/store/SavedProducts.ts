import Store, {Options} from "electron-store"
import {app} from "electron"
import * as fs from "fs";
import path from "path";
import {ISavedProduct} from "../../../src/store/ScanProductStore";

export class SavedProducts extends Store {
    data = new Array<ISavedProduct>()

    constructor(userId: string | number, settings?: Options<any>) {
        const userDirectory = path.join(app.getPath("userData"), `/user.${userId}`)
        if (!fs.existsSync(userDirectory)) {
            fs.mkdirSync(userDirectory)
        }
        super({name: `products`, cwd: userDirectory, ...settings});
        this.data = this.get("data") as ISavedProduct[] || new Array<ISavedProduct>()
    }

    getProducts() {
        this.data = this.get("data") as ISavedProduct[] || new Array<ISavedProduct>()
        return this
    }

    saveProduct(data: ISavedProduct[]) {
        this.set({data})
        return this
    }
}