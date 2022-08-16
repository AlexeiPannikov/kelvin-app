import $api from "../api";
import {BaseResponse} from "../models/responses/BaseResponse";
import {SampleModel} from "../models/responses/Samples/SampleModel";
import {GetSampleData} from "../models/responses/Samples/GetSampleData";

class SamplesService {

    async getSample(uuid: string): Promise<SampleModel> {
        const res = await $api.get<BaseResponse<GetSampleData>>(`samples/${uuid}`);
        if (res?.data.success) {
            return res.data.data.sample;
        }
    }

    async search(barcode: string): Promise<SampleModel[]> {
        const res = await $api.post<BaseResponse<{ found: SampleModel[] }>>(
            "samples/search",
            {},
            {params: {barcode}}
        );
        if (res?.data?.success) {
            return res.data.data.found;
        }
    }
}

export default new SamplesService();
