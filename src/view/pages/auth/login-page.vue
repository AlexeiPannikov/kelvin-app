<template>
  <component :is="components[currentComponent]"
             @configured="configuredHandler"
  ></component>
</template>

<script lang="ts" setup>

import {defineAsyncComponent, ref} from "vue";

const LoginModal = defineAsyncComponent(() => import("./login-modal.vue"))
const PrimarySettings = defineAsyncComponent(() => import("./primary-settings.vue"))

const currentComponent = ref("")

const components = {
  LoginModal,
  PrimarySettings
}

const initComponent = () => {
  const primarySettings = JSON.parse(localStorage.getItem("primary_settings"))
  currentComponent.value = primarySettings ?
      "LoginModal" :
      "PrimarySettings"
}
initComponent()

const configuredHandler = () => {
  currentComponent.value = "LoginModal"
}
</script>

<style lang="scss" scoped>

</style>
