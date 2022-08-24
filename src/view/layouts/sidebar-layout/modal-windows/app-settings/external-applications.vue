<template>
  <div>
    <v-card flat>
      <v-card-title>
        External Applications
      </v-card-title>
      <v-card-subtitle class="text-wrap">
        Certain functions in Kelvin use Adobe Photoshop and Adobe Bridge. Please point Kelvin to the right application
        paths if you wish to use these functions.
      </v-card-subtitle>
      <select-external-applications
      ></select-external-applications>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import {useUserSettingsStore} from "../../../../../store/UserSettingsStore";
import {ref} from "vue";
import SelectExternalApplications from "../../../../pages/components/select-external-applications.vue";

const userSettingsStore = useUserSettingsStore()
const isValidPhotoshopPath = ref(true)
const isValidBridgePath = ref(true)

const selectPhotoshopPath = async () => {
  const path = await userSettingsStore.selectFile([{name: "Applications", extensions: ["exe"]}])
  if (path) {
    const index = path.lastIndexOf("\\")
    const fileName = path.substring(index + 1, path.length)
    userSettingsStore.primarySettings.adobeApplications.ps = path
    fileName.toLowerCase().trim().includes("photoshop") ?
        isValidPhotoshopPath.value = true :
        isValidPhotoshopPath.value = false
  }
}

const selectBridgePath = async () => {
  const path = await userSettingsStore.selectFile([{name: "Applications", extensions: ["exe"]}])
  if (path) {
    const index = path.lastIndexOf("\\")
    const fileName = path.substring(index + 1, path.length)
    userSettingsStore.primarySettings.adobeApplications.br = path
    fileName.toLowerCase().trim().includes("bridge") ?
        isValidBridgePath.value = true :
        isValidBridgePath.value = false
  }
}
</script>

<style lang="scss" scoped>

</style>