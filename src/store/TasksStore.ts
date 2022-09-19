import {defineStore} from "pinia";
import FilesService from "../api/services/FilesService";
import {GetTaskResponse} from "../api/models/responses/Tasks/GetTaskResponse";
import TasksService from "../api/services/TasksService";

interface IState {
    isLoadingTask: boolean,
    taskData: GetTaskResponse
}

export const useTasksStore = defineStore("tasks", {
    state: () => {
        return <IState>{
            isLoadingTask: false,
            taskData: new GetTaskResponse()
        };
    },

    actions: {
        async getTask(uuid: string) {
            this.isLoadingTask = true
            try {
                const res = await TasksService.getTask(uuid)
                if (res) {
                    this.taskData = res
                    await FilesService.filesDownloader("assets", this.taskData.rejectedImages)
                    this.taskData.rejectedFiles.forEach(item => {
                        if (!item.fileEdited.uuid)
                            item.fileEdited.url = item.fileOriginal.url
                    })
                }
            } finally {
                this.isLoadingTask = false
            }
        },
    },
});
