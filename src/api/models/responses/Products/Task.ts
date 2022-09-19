import {Step} from "./Step";

export class Task {
    id: number = null
    studio_id: number = null
    product_id: number = null
    shooting_type_id: number = null
    status = ""
    step = ""
    uuid = ""
    finished_at: string = null
    is_picked = 0
    is_rejected = 0
    steps = new Array<Step>()

    constructor(obj?: Partial<Task>) {
        if (obj) Object.assign(this, obj)
    }
}