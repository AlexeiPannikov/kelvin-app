<template>
  <v-app full-height>
    <sidebar-layout></sidebar-layout>
    <header-layout></header-layout>
    <v-main>
      <v-container fluid class="bg-main-content-back fill-height main-container px-0 py-0">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import HeaderLayout from "./header-layout.vue";
import SidebarLayout from "./sidebar-layout/sidebar-layout.vue";
import {useUserSettingsStore} from "../../store/UserSettingsStore";
import {useRouter} from "vue-router";
import {useCurrentUserStore} from "../../store/CurrentUserStore";

const router = useRouter()
const userSettingsStore = useUserSettingsStore()
const currentUserStore = useCurrentUserStore()

userSettingsStore.getSettings().then(() => {
  userSettingsStore.getRootFolder().then(() => {
    if (!userSettingsStore.primarySettings.folder) {
      router.push("primary-settings")
    }
  })
})

currentUserStore.getCurrentUser()

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
