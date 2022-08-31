<script setup lang="ts">
import {ref} from "vue";
import {useCurrentUserStore} from "./store/CurrentUserStore";
import {useRouter} from "vue-router";
import UiNotification from "./view/components/ui-notifications/ui-notification.vue";
import {ipcRenderer} from "electron";
import AboutModal from "./view/layouts/components/about-modal.vue";

const store = useCurrentUserStore()
const router = useRouter()
const isOpenAbout = ref(false)

ipcRenderer.on("open-about-app", () => isOpenAbout.value = true)
</script>

<template>
  <router-view>
  </router-view>

  <ui-notification></ui-notification>

  <about-modal v-model="isOpenAbout"
               @ok="isOpenAbout = false"
  ></about-modal>
</template>

<style lang="scss">
@import "assets/syles/styles.scss";

body, html {
  height: 100vh;
  overflow: hidden !important;
}

#app {
  height: 100%;
}
</style>
