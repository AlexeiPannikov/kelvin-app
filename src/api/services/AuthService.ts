import { LoginResponse } from "../models/responses/Auth/LoginResponse";
import { GetCurrentUserResponse } from "../models/responses/Users/GetCurrentUserResponse";
import { LoginRequest } from "../models/requests/Auth/LoginRequest";
import $api from "../api";
import { LogoutResponse } from "../models/responses/Auth/LogoutResponse";

class AuthService {
  async login(data: LoginRequest): Promise<boolean> {
    const res = await $api.post<LoginResponse>("auth/login", data);
    if (res?.data) {
      localStorage.setItem("token", `${res.data.access_token}`);
      return true;
    }
  }

  async getCurrentUser(): Promise<GetCurrentUserResponse> {
    const res = await $api.post<GetCurrentUserResponse>("auth/me");
    if (res.data) {
      return res.data;
    }
  }

  async logout(): Promise<boolean> {
    const res = await $api.post<LogoutResponse>("auth/logout");
    if (res?.data) {
      localStorage.removeItem("token");
      return true;
    }
    return false;
  }
}

export default new AuthService();
