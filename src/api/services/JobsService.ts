import {BaseResponse} from "../models/responses/BaseResponse";
import {GetJobsData} from "../models/responses/Jobs/GetJobsData";
import $api from "../api";

class JobsService {
    async getJobs(free_text: string): Promise<GetJobsData> {
        const res = await $api.post<BaseResponse<GetJobsData>>("jobs", {
            properties: [
                {
                    id: null,
                    value: null
                }
            ]
        }, {params: {free_text}});
        if (res?.data.success) {
            return res.data.data;
        }
    }
}

export default new JobsService();
