<script setup lang="ts">
import {onMounted} from "vue";
import {useCurrentUserStore} from "./store/CurrentUserStore";
import {useRouter} from "vue-router";
import UiNotification from "./view/components/ui-notifications/ui-notification.vue";

const store = useCurrentUserStore()
const router = useRouter()

onMounted(async () => {

})
</script>

<template>
  <router-view>
  </router-view>
  <ui-notification></ui-notification>
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
