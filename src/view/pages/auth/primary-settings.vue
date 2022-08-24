<template>
  <div class="d-flex align-center justify-center fill-height">
    <v-card max-width="600">
      <template v-if="step === 1">
        <v-card-title class="text-center">
          SETUP A CALVIN WORKING FOLDER
        </v-card-title>
        <v-card-text class="text-center">
          Kelvin requires a place to store various data files like transfer history, style, guide library etc. while
          working. Please create a folder on your disc
        </v-card-text>
        <div class="d-flex justify-center py-16 px-16">
          <button-blue @click="selectDirectory"
                       size="large"
                       v-if="!userSettingsStore.primarySettings.folder"
          >
            Select
          </button-blue>
          <div v-else class="d-flex align-center w-100">
            <v-text-field variant="outlined"
                          density="compact"
                          v-model="userSettingsStore.primarySettings.folder"
                          readonly
                          hide-details
            >
            </v-text-field>
            <button-white @click="selectDirectory" size="small" class="ml-3">
              <v-icon size="27">mdi-dots-horizontal</v-icon>
            </button-white>
          </div>
        </div>

        <v-card-item class="justify-center">
          <button-blue @click="saveDirectory"
                       size="large"
                       v-if="userSettingsStore.primarySettings.folder"
          >
            Continue
          </button-blue>
        </v-card-item>
      </template>

      <template v-if="step === 2">
        <v-card-title class="text-center">
          TRANSFER HISTORY
        </v-card-title>
        <v-card-text class="text-center">
          Kelvin can store your transfer history for as long as you want but will consume more disc space the longer
          files are kept.
        </v-card-text>
        <div class="d-flex justify-center align-center py-16 px-16">
          <span>Keep transfer history for</span>
          <div class="w-25">
            <v-text-field type="number"
                          variant="outlined"
                          density="compact"
                          hide-details
                          class="ml-5 mr-5"
                          v-model="userSettingsStore.primarySettings.transferHistory"
            >
            </v-text-field>
          </div>
          <span>day(s)</span>
        </div>

        <v-card-item class="justify-center">
          <button-blue @click="saveTransferHistory"
                       size="large"
                       :disabled="!userSettingsStore.primarySettings.transferHistory"
          >
            Continue
          </button-blue>
        </v-card-item>
      </template>

      <template v-if="step === 3">
        <v-card-title class="text-center">
          ADOBE APPLICATIONS
        </v-card-title>
        <v-card-text class="text-center">
          Certain functions in Kelvin use Adobe Photoshop and Adobe Bridge.
          Please point Kelvin to the right application paths if you wish to use these functions.
        </v-card-text>
        <select-external-applications
        ></select-external-applications>
        <v-card-item class="justify-center">
          <button-blue @click="saveAdobeApps"
                       size="large"
                       :disabled="!userSettingsStore.isValidPhotoshopPath || !userSettingsStore.isValidBridgePath"
          >
            Continue
          </button-blue>
        </v-card-item>
      </template>

      <template v-if="step === 4">
        <v-card-title class="text-center">
          ALL SETUP
        </v-card-title>
        <v-card-text class="text-center">
          Kelvin is now set up correctly and is ready for use.
          Please remember that all settings can be changed under Kelvin Settings
        </v-card-text>
        <div class="d-flex justify-center align-center py-16 px-16">
          <div class="w-100 d-flex justify-center">
            <div class="bg-white rounded-circle px-2 py-2">
              <v-icon size="40">
                mdi-check
              </v-icon>
            </div>
          </div>
        </div>

        <v-card-item class="justify-center">
          <button-blue @click="finish"
                       size="large"
          >
            START USING KELVIN
          </button-blue>
        </v-card-item>
      </template>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import ButtonBlue from "../../components/buttons/button-blue.vue";
import {ref} from "vue";
import ButtonWhite from "../../components/buttons/button-white.vue";
import {useCurrentUserStore} from "../../../store/CurrentUserStore";
import {useRouter} from "vue-router";
import {useUserSettingsStore} from "../../../store/UserSettingsStore";
import SelectExternalApplications from "../components/select-external-applications.vue";

const router = useRouter()

const step = ref(1)
const store = useCurrentUserStore()
const userSettingsStore = useUserSettingsStore()

const selectDirectory = async () => {
  const newDir = await userSettingsStore.selectDirectory()
  if (newDir)
    userSettingsStore.primarySettings.folder = newDir
}

const saveDirectory = () => {
  userSettingsStore.saveSettings()
  step.value = 2
}

const saveTransferHistory = () => {
  step.value = 3
}

const saveAdobeApps = () => {
  userSettingsStore.saveSettings()
  step.value = 4
}

const finish = () => {
  router.push("/")
}
</script>

<style lang="scss" scoped>

</style>