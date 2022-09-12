<template>
  <v-app full-height>
    <sidebar-layout></sidebar-layout>
    <header-layout></header-layout>
    <v-main>
      <v-container fluid class="bg-main-content-back fill-height main-container px-0 py-0">
        <router-view></router-view>
      </v-container>
    </v-main>

    <edit-team-on-set-modal v-model="isOpenEditTeamOnSetModal"
                            @cancel="isOpenEditTeamOnSetModal = false"
    ></edit-team-on-set-modal>
  </v-app>
</template>

<script lang="ts" setup>
import HeaderLayout from "./header-layout.vue";
import SidebarLayout from "./sidebar-layout/sidebar-layout.vue";
import {useUserSettingsStore} from "../../store/UserSettingsStore";
import {useRouter} from "vue-router";
import {useCurrentUserStore} from "../../store/CurrentUserStore";
import {useUsersStore} from "../../store/UsersStore";
import {useTeamOnSetStore} from "../../store/TeamOnSetStore";
import {onMounted, onUnmounted, ref} from "vue";
import EditTeamOnSetModal from "./sidebar-layout/modal-windows/edit-team-on-set-modal.vue";
import {useFilesViewStore} from "../../store/FilesViewStore";

const router = useRouter()
const userSettingsStore = useUserSettingsStore()
const filesViewStore = useFilesViewStore()
const teamOnSetStore = useTeamOnSetStore()
const isOpenEditTeamOnSetModal = ref(false)

userSettingsStore.getSettings().then(() => {
  filesViewStore.getRootFolder().then(() => {
    if (!userSettingsStore.primarySettings.folder) {
      router.push("primary-settings")
    } else router.push("/")
  })
})

onMounted(async () => {
  await teamOnSetStore.init()
  isOpenEditTeamOnSetModal.value = true
})

const handler = () => {
  router.push({name: "login"});
  document.removeEventListener("not-authorized", handler);
};

document.addEventListener("not-authorized", handler);

onUnmounted(() => document.removeEventListener("not-authorized", handler));
</script>

<style lang="scss">
.v-application {
  max-height: 100% !important;
}

.v-main {
  height: 100%;
}

.main-container {
  overflow: hidden;
}
</style>
