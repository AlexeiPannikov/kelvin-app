import {UserModel} from "../api/models/responses/Users/UserModel";
import UsersService from "../api/services/UsersService";
import {defineStore} from "pinia";

interface IState {
    isLoadingUsers: boolean;
    users: UserModel[];
}

export const useUsersStore = defineStore("users", {
    state: () => {
        return {
            isLoadingUsers: false,
            users: new Array<UserModel>(),
        } as IState;
    },

    getters: {
        usersSelectList(): { title: string, value: number }[] {
            return this.users.map(({id, name}) => ({title: name, value: id}))
        }
    },

    actions: {
        async getUsers() {
            this.isLoadingUsers = true;
            try {
                const res = await UsersService.getUsers();
                if (res) {
                    this.users = res;
                }
            } finally {
                this.isLoadingUsers = false;
            }
        },
    },
});
