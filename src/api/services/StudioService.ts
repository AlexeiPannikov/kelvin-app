import {ProductionType} from "../models/ProductionType";
import {BaseResponse} from "../models/responses/BaseResponse";
import $api from "../api";

class StudioService {

  async getProductionTypes(): Promise<ProductionType[]> {
    const res = await $api.get<BaseResponse<ProductionType[]>>(
      "studio/production_types"
    );
    if (res?.data?.success) {
      return res.data.data;
    }
  }
}

export default new StudioService();
