<script setup lang="ts">
import {onMounted} from "vue";
import {ipcRenderer} from "electron";
import {useCurrentUserStore} from "./store/CurrentUserStore";
import {useRouter} from "vue-router";

const store = useCurrentUserStore()
const router = useRouter()

onMounted(async () => {

})
</script>

<template>
  <router-view>
  </router-view>
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
