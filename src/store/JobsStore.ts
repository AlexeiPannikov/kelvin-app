import JobsService from "../api/services/JobsService";
import {defineStore} from "pinia";
import {JobModel} from "../api/models/responses/Jobs/JobModel";

interface IJobStore {
    isLoadingJobs: boolean;
    jobs: JobModel[];
}

export const useJobsStore = defineStore("jobs", {
    state: () => {
        return <IJobStore>{
            isLoadingJobs: false,
            jobs: new Array<JobModel>(),
        };
    },

    actions: {
        async getJobs(free_text: string) {
            this.isLoadingJobs = true;
            try {
                const res = await JobsService.getJobs(free_text);
                if (res) {
                    this.jobs.push(...res.list.data);
                }
            } finally {
                this.isLoadingJobs = false;
            }
        },
    },
})
