import FilesService from "../../../services/FilesService";
import {StepsEnum} from "../../requests/Tasks/StepsEnum";
import TasksService from "../../../services/TasksService";
import {StatusAndTasks} from "./StatusAndTasks";


export class GetTasksResponse {
    has_update = false
    hash = ""
    list: StatusAndTasks[] = []
    private updatedData: GetTasksResponse = null
    isLoading = false
    private timer: NodeJS.Timer = null
    step: StepsEnum = null

    constructor(obj?: Partial<GetTasksResponse>) {
        if (obj) {
            Object.assign(this, obj)
            if (obj.list) {
                this.list = obj.list.map(item => new StatusAndTasks(item))
            }
        }
    }

    get isHasUpdates() {
        return this.updatedData?.has_update
    }

    get allTasks() {
        return this.list.map(({tasks}) => tasks).flat()
    }

    async startCheckUpdates(step: StepsEnum) {
        // const getUpdates = async () => {
        //     const res = await TasksService.getTasks({step, hash: this.hash})
        //     this.step = step
        //     if (res) {
        //         this.updatedData = new GetTasksResponse({...res, step})
        //
        //     }
        // }
        // try {
        //     this.timer = setInterval(async () => {
        //         await getUpdates()
        //     }, 10000)
        // } catch (e) {
        //     console.log(e)
        // }
    }

    stopCheckUpdates() {
        clearInterval(this.timer)
    }

    async acceptUpdates() {
        Object.assign(this, this.updatedData)
        await FilesService.filesDownloader("assets", this.allTasks.map(({uploadFiles}) => uploadFiles).flat())
        this.has_update = false
        this.stopCheckUpdates()
        await this.startCheckUpdates(this.step)
    }
}