import $api from "../api";
import { ClientModel } from "../models/responses/Clients/ClientModel";
import {BaseResponse} from "../models/responses/BaseResponse";
import {GetClientResponse} from "../models/responses/Clients/GetClientResponse";

class ClientsService {

  async getClients(): Promise<ClientModel[]> {
    const res = await $api.get<BaseResponse<ClientModel[]>>("studio/clients");
    if (res?.data?.success) {
      return res.data.data;
    }
  }

  async getClient(id: string): Promise<GetClientResponse> {
    const res = await $api.get<BaseResponse<GetClientResponse>>(
      `studio/clients/${id}`
    );
    if (res?.data?.success) {
      return res.data.data;
    }
  }
}

export default new ClientsService();
