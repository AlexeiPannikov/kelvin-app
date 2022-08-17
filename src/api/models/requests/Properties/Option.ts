export class Option  {
    option = ""
    default = false

    constructor(_option: string, _default: boolean) {
        this.option = _option
        this.default = _default
    }
}