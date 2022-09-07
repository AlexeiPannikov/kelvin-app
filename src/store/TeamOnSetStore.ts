import {defineStore} from "pinia";
import {ProductionType} from "../api/models/ProductionType";
import StudioService from "../api/services/StudioService";
import {useUsersStore} from "./UsersStore";
import {useCurrentUserStore} from "./CurrentUserStore";
import {MemberOfTheTeam} from "./models/MemberOfTheTeam";
import {useUserSettingsStore} from "./UserSettingsStore";

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
            const userSettingsStore = useUserSettingsStore()
            const {primarySettings} = userSettingsStore
            if (primarySettings.teamOnSet?.length) {
                this.teamOnSet = usersStore.users.filter(({id}) => primarySettings.teamOnSet.includes(id.toString()))
                    .map(({
                              id,
                              name
                          }) => new MemberOfTheTeam({
                        id,
                        name
                    }))
                const isNotExistInList = !this.teamOnSet.find(({id}) => currentUserStore.currentUser.id === id)
                if (isNotExistInList) {
                    this.teamOnSet.unshift(currentUserStore.currentUser)
                }
            } else {
                const {id, name} = currentUserStore.currentUser
                this.teamOnSet.push(new MemberOfTheTeam({
                    id,
                    name
                }))
            }
            this.teamOnSetTempList = [...this.teamOnSet]
        },

        addMembersOnTeam() {
            this.teamOnSet = [...this.teamOnSetTempList]
            const userSettingsStore = useUserSettingsStore()
            userSettingsStore.primarySettings.teamOnSet = this.teamOnSet.map(({id}) => id.toString())
            userSettingsStore.saveSettings()
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
