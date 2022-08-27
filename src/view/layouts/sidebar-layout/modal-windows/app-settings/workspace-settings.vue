<template>
  <div>
    <v-card flat class="border-b pt-2">
      <v-card-title>
        Working Folder
      </v-card-title>
      <v-card-subtitle>
        Your working folder on PC.
      </v-card-subtitle>
      <v-card-item class="pb-6">
        <div class="d-flex align-center w-100">
          <v-text-field variant="outlined"
                        density="compact"
                        v-model="userSettingsStore.newRootFolder"
                        readonly
                        hide-details
          >
          </v-text-field>
          <button-white @click="selectDirectory" size="small" class="ml-3">
            <v-icon size="27">mdi-dots-horizontal</v-icon>
          </button-white>
        </div>
      </v-card-item>
    </v-card>
    <v-card flat class="border-b pt-2">
      <v-card-title>
        Transfer History
      </v-card-title>
      <v-card-subtitle class="text-wrap">
        App can store your transfer history for as long as you want but will
        consume more disc space the longer files are kept.
      </v-card-subtitle>
      <v-card-item class="pb-6">
        <div class="d-flex align-center justify-space-between w-100">
          <div class="mr-2">
            <div class="pb-2">KEEP TRANSFER HISTORY FOR</div>
            <v-text-field variant="outlined"
                          density="compact"
                          hide-details
                          type="number"
                          label="day(s)"
                          min="0"
                          v-model="userSettingsStore.primarySettings.transferHistory"
            >
            </v-text-field>
          </div>
          <div class="ml-2">
            <div class="pb-2">KEEP SAVED SELECTIONS FOR</div>
            <v-text-field variant="outlined"
                          density="compact"
                          hide-details
                          type="number"
                          label="day(s)"
                          min="0"
            >
            </v-text-field>
          </div>
        </div>
      </v-card-item>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import {useUserSettingsStore} from "../../../../../store/UserSettingsStore";
import ButtonWhite from "../../../../components/buttons/button-white.vue";

const userSettingsStore = useUserSettingsStore()

const selectDirectory = async () => {
  const selectedDir = await userSettingsStore.selectDirectory()
  if (selectedDir)
    userSettingsStore.newRootFolder = selectedDir
}

</script>

<style lang="scss" scoped>

</style>