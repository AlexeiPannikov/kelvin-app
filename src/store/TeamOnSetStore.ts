import {defineStore} from "pinia";
import {ProductionType} from "../api/models/ProductionType";
import StudioService from "../api/services/StudioService";
import {useUsersStore} from "./UsersStore";
import {useCurrentUserStore} from "./CurrentUserStore";
import {MemberOfTheTeam} from "./models/MemberOfTheTeam";

export const useTeamOnSetStore = defineStore("team-on-set", {
    state: () => {
        return {
            teamOnSet: new Array<MemberOfTheTeam>(),
            teamOnSetTempList: new Array<MemberOfTheTeam>(),
        };
    },

    getters: {},

    actions: {
        async init() {
            const usersStore = useUsersStore()
            const currentUserStore = useCurrentUserStore()
            await currentUserStore.getCurrentUser()
            await usersStore.getUsers()
            const {id, name} = currentUserStore.currentUser
            this.teamOnSet.push(new MemberOfTheTeam({
                id,
                name
            }))
            this.teamOnSetTempList = [...this.teamOnSet]
        },

        addMembersOnTeam() {
            this.teamOnSet = [...this.teamOnSetTempList]
        },

        addInTempList(member: MemberOfTheTeam) {
            this.teamOnSetTempList.push(member)
        },

        resetTempList() {
            this.teamOnSetTempList = [...this.teamOnSet]
        },

        deleteMemberFromTeam(id: number) {
            this.teamOnSetTempList = this.teamOnSetTempList.filter(item => item.id !== id)
        },
    },
});
