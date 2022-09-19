import {Task} from "./Task";

type Status = "To Do" | "Doing" | "Done"

export class StatusAndTasks {
    status: Status = null
    tasks: Task[] = []

    constructor(obj?: Partial<StatusAndTasks>) {
        if (obj) {
            Object.assign(this, obj)
            if (obj.tasks) {
                this.tasks = obj.tasks.map(item => new Task(item))
            }
        }
    }

    get hasSelectedTask() {
        return !!this.tasks.find(item => item.isSelected)
    }

    get selectedTasks() {
        return this.tasks.filter(item => item.isSelected)
    }

    get selectedPickedTasks() {
        return this.selectedTasks.filter(({is_picked}) => !!is_picked)
    }

    get selectedUnpickedTasks() {
        return this.selectedTasks.filter(({is_picked}) => !is_picked)
    }

    get selectedTasksNumber() {
        return this.tasks.filter(item => item.isSelected).length
    }

    get imagesNumber() {
        return this.tasks.map(({uploads_files_uuid}) => uploads_files_uuid).flat().length
    }

    selectAllTasks() {
        this.tasks.forEach(item => item.isSelected = true)
    }

    selectUserTasks(user_id: number) {
        this.tasks.forEach(item => {
            item.worker_id === user_id ? item.isSelected = true : item.isSelected = false
        })
    }

    resetAllSelect() {
        this.tasks.forEach(item => item.isSelected = false)
    }
}