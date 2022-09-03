import $api from "../api";
import {UserModel} from "../models/responses/Users/UserModel";
import {BaseResponse} from "../models/responses/BaseResponse";

class UsersService {
  constructor() {}

  async getUsers(): Promise<UserModel[]> {
    const res = await $api.get<BaseResponse<UserModel[]>>("users");
    if (res?.data) {
      return res.data.data;
    }
  }
}

export default new UsersService();
