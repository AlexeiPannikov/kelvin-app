import { defineStore } from "pinia";
import {UserModel} from "../api/models/responses/Users/UserModel";
import AuthService from "../api/services/AuthService";
import {LoginRequest} from "../api/models/requests/Auth/LoginRequest";

export const useCurrentUserStore = defineStore("current-user", {
  state: () => {
    return {
      isLoadingLoginUser: false,
      isLoadingCurrentUser: false,
      currentUser: new UserModel(),
    };
  },

  actions: {
    async login(data: LoginRequest) {
      this.isLoadingLoginUser = true;
      try {
        const res = await AuthService.login(data);
        if (res) {
          return true;
        }
      } finally {
        this.isLoadingLoginUser = false;
      }
    },

    async getCurrentUser() {
      this.isLoadingCurrentUser = true;
      try {
        const res = await AuthService.getCurrentUser();
        if (res) {
          this.currentUser = new UserModel({
            id: res.id,
            name: res.name,
            email: res.email,
            avatar: `${import.meta.env.VITE_BASE_URL}/${res.avatar}`,
          });
          return this.currentUser;
        }
      } catch (e: any) {
        this.currentUser = null;
      } finally {
        this.isLoadingCurrentUser = false;
      }
    },

    async logout(): Promise<boolean> {
      this.isLoadingLoginUser = true;
      try {
        const res = await AuthService.logout();
        if (res) {
          this.$reset();
          return true;
        }
      } finally {
        this.isLoadingLoginUser = false;
      }
    },
  },
});
