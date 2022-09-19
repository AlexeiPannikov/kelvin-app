import {BaseResponse} from "../models/responses/BaseResponse";
import $api from "../api";
import {GetTaskResponse} from "../models/responses/Tasks/GetTaskResponse";

class TasksService {
    async getTask(task_uuid: string) {
        const res = await $api.get<BaseResponse<GetTaskResponse>>(`tasks/${task_uuid}`,)
        if (res?.data?.success) {
            return new GetTaskResponse(res.data.data)
        }
    }
}

export default new TasksService();
