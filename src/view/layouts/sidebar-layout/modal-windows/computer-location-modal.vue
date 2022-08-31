<template>
  <v-dialog persistent
  >
    <v-card min-width="200" max-width="500">
      <v-card-title class="border-b">
        <h3 class="font-weight-medium">COMPUTER LOCATION</h3>
      </v-card-title>
      <v-card-text>
        <div class="description">
          Defining the Computer Location will automatically and silently update the whereabouts of every sample you
          scan.
        </div>
      </v-card-text>
      <v-card-item>
        <h4 class="mb-2">LOCATION</h4>
        <v-select
            v-model="userSettingsStore.primarySettings.computerLocation.locationUuid"
            :items="locationsStore.locationsSelectList"
            density="compact"
            variant="outlined"
            hide-details
        ></v-select>
        <div class="d-flex align-center w-100">
          <v-icon>mdi-arrow-right-bottom-bold</v-icon>
          <v-select
              v-if="locationsStore.subLocationsSelectList.length"
              v-model="userSettingsStore.primarySettings.computerLocation.subLocationUuid"
              :items="locationsStore.subLocationsSelectList"
              density="compact"
              variant="outlined"
              class="mt-4"
              hide-details
          ></v-select>
        </div>
      </v-card-item>
      <v-card-actions>
        <v-checkbox label="Dont ask me again"
                    density="compact"
                    color="primary"
                    v-model="userSettingsStore.primarySettings.computerLocation.dontAskAgain"
                    hide-details
        >
        </v-checkbox>
        <v-spacer></v-spacer>
        <button-white @click="reset"
        >
          Cancel
        </button-white>
        <button-blue
            @click="saveLocation"
        >
          Save
        </button-blue>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import ButtonWhite from "../../../components/buttons/button-white.vue";
import ButtonBlue from "../../../components/buttons/button-blue.vue";
import {onMounted, ref, watch} from "vue";
import {useLocationsStore} from "../../../../store/LocationsStore";
import {useUserSettingsStore} from "../../../../store/UserSettingsStore";

const emit = defineEmits(['cancel', 'save'])

const locationsStore = useLocationsStore()
const userSettingsStore = useUserSettingsStore()

locationsStore.getLocations()

watch(() => userSettingsStore.primarySettings.computerLocation.locationUuid, () => {
  if (userSettingsStore.primarySettings.computerLocation.locationUuid !== "")
    locationsStore.getLocation(userSettingsStore.primarySettings.computerLocation.locationUuid)
  else {
    userSettingsStore.primarySettings.computerLocation.subLocationUuid = ""
    locationsStore.resetSubLocations()
  }
})

const saveLocation = () => {
  userSettingsStore.saveSettings()
  emit('cancel')
}

const reset = () => {
  userSettingsStore.getSettings()
  emit('cancel')
}
</script>

<style lang="scss" scoped>

</style>