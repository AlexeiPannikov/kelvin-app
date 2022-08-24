<template>
  <v-card-item class="pb-6">
    <div class="d-flex align-center">
      <div class="mr-4">
        <v-img aspect-ratio="1"
               width="80"
               :src="PtsImg"
               :transition="null"
        ></v-img>
      </div>
      <button-white v-if="!userSettingsStore.primarySettings.adobeApplications.ps"
                    @click="selectPhotoshopPath"
      >
        Select
      </button-white>
      <v-text-field v-else
                    variant="outlined"
                    density="compact"
                    v-model="userSettingsStore.primarySettings.adobeApplications.ps"
                    readonly
                    hide-details
                    clearable
                    @click:clear="userSettingsStore.isValidPhotoshopPath = true"
      >
      </v-text-field>
      <div style="height: 40px; width: 40px" class="ml-2">
        <v-icon v-if="userSettingsStore.primarySettings.adobeApplications.ps"
                :color="userSettingsStore.isValidPhotoshopPath ? 'green' : 'red'"
                size="35"
        >mdi-check
        </v-icon>
      </div>
    </div>
  </v-card-item>
  <v-card-item>
    <div class="d-flex align-center">
      <div class="mr-4">
        <v-img aspect-ratio="1"
               width="80"
               :src="BrImg"
               :transition="null"
        ></v-img>
      </div>
      <button-white v-if="!userSettingsStore.primarySettings.adobeApplications.br"
                    @click="selectBridgePath"
      >
        Select
      </button-white>
      <v-text-field v-else
                    variant="outlined"
                    density="compact"
                    v-model="userSettingsStore.primarySettings.adobeApplications.br"
                    readonly
                    hide-details
                    clearable
                    @click:clear="userSettingsStore.isValidBridgePath = true"
      >
      </v-text-field>
      <div style="height: 40px; width: 40px" class="ml-2">
        <v-icon v-if="userSettingsStore.primarySettings.adobeApplications.br"
                :color="userSettingsStore.isValidBridgePath ? 'green' : 'red'"
                size="35"
        >mdi-check
        </v-icon>
      </div>
    </div>
  </v-card-item>
</template>

<script lang="ts" setup>

import {useUserSettingsStore} from "../../../store/UserSettingsStore";
import ButtonWhite from "../../components/buttons/button-white.vue";
import PtsImg from "../../../assets/icons/adobe-photoshop-cs4-logo-vector.svg"
import BrImg from "../../../assets/icons/br.png"
import {onMounted} from "vue";

const userSettingsStore = useUserSettingsStore()

onMounted(() => console.log(userSettingsStore.primarySettings))

const selectPhotoshopPath = async () => {
  const path = await userSettingsStore.selectFile([{name: "Applications", extensions: ["exe"]}])
  if (path) {
    const index = path.lastIndexOf("\\")
    const fileName = path.substring(index + 1, path.length)
    userSettingsStore.primarySettings.adobeApplications.ps = path
    fileName.toLowerCase().trim().includes("photoshop") ?
        userSettingsStore.isValidPhotoshopPath = true :
        userSettingsStore.isValidPhotoshopPath = false
  }
}

const selectBridgePath = async () => {
  const path = await userSettingsStore.selectFile([{name: "Applications", extensions: ["exe"]}])
  if (path) {
    const index = path.lastIndexOf("\\")
    const fileName = path.substring(index + 1, path.length)
    userSettingsStore.primarySettings.adobeApplications.br = path
    fileName.toLowerCase().trim().includes("bridge") ?
        userSettingsStore.isValidBridgePath = true :
        userSettingsStore.isValidBridgePath = false
  }
}
</script>

<style lang="scss" scoped>

</style>