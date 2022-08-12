export class Asset {
    id: number = null
    output_name = ""
    preset_uuid: string = null
    preset: boolean = null
    preset_id: number = null

    constructor(obj?: Partial<Asset>) {
        if (obj) {
            Object.assign(this, obj)
        }
    }
}
