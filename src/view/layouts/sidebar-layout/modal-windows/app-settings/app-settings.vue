<template>
  <v-dialog>
    <v-card min-width="800">
      <v-card-title class="d-flex align-center">
        APP SETTINGS
      </v-card-title>
      <v-card-text style="height: 500px;">
        <v-row class="fill-height">
          <v-col cols="4" class="border-e">
            <v-list density="compact" class="pl-2">
              <v-list-item @click="setTab('General')"
                           :active="selectedTab === 'General'"
                           rounded
              >
                General
              </v-list-item>
              <v-list-item @click="setTab('Workspace')"
                           :active="selectedTab === 'Workspace'"
                           rounded
              >
                Workspace
              </v-list-item>
              <v-list-item @click="setTab('External Applications')"
                           :active="selectedTab === 'External Applications'"
                           rounded
              >
                External Applications
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="8" class="pb-0">
            <v-row class="fill-height d-flex flex-column" no-gutters>
              <v-col class="text-h5 flex-grow-0 pl-3 pb-4">{{ selectedTab }}</v-col>
              <v-col class="flex-grow-1 overflow-y-auto">
                <keep-alive>
                  <general-settings v-if="selectedTab === 'General'"
                  ></general-settings>
                </keep-alive>
                <keep-alive>
                  <workspace-settings v-if="selectedTab === 'Workspace'"
                  ></workspace-settings>
                </keep-alive>
                <keep-alive>
                  <external-applications v-if="selectedTab === 'External Applications'"
                  ></external-applications>
                </keep-alive>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="mt-3">
        <div class="text-yellow-accent-3 pl-4" v-if="isChanged && isValidData">
          Restart App to apply this changes
        </div>
        <v-spacer></v-spacer>
        <button-white @click="cancel"
        >
          Cancel
        </button-white>
        <button-blue @click="save"
                     :disabled="!isChanged || !isValidData"
        >
          Save
        </button-blue>
        <button-blue @click="saveAndRestart"
                     v-if="isChanged && isValidData"
                     :disabled="!isChanged || !isValidData"
        >
          Save & Restart
        </button-blue>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import {computed, ref, useAttrs, watch} from "vue";
import ButtonWhite from "../../../../components/buttons/button-white.vue";
import ButtonBlue from "../../../../components/buttons/button-blue.vue";
import WorkspaceSettings from "./workspace-settings.vue";
import {useUserSettingsStore} from "../../../../../store/UserSettingsStore";
import {ipcRenderer} from "electron"
import ExternalApplications from "./external-applications.vue";
import GeneralSettings from "./general-settings.vue";

const emit = defineEmits(['cancel'])

type TabName = "General" | "Workspace" | "External Applications"
const selectedTab = ref<TabName>("General")
const userSettingsStore = useUserSettingsStore()
const settingsCopy = ref("")
const attrs = useAttrs()

const isChanged = computed(() => {
  return settingsCopy.value !== JSON.stringify(userSettingsStore.primarySettings)
      || userSettingsStore.primarySettings.folder !== userSettingsStore.newRootFolder
})

const isValidData = computed(() => {
  return !!(userSettingsStore.isValidPhotoshopPath && userSettingsStore.isValidBridgePath &&
      userSettingsStore.newRootFolder
  )
})

watch(() => attrs.modelValue, () => {
  if (attrs.modelValue)
    settingsCopy.value = JSON.stringify(userSettingsStore.primarySettings)
  userSettingsStore.newRootFolder = userSettingsStore.primarySettings.folder
})

const setTab = (tabName: TabName) => {
  selectedTab.value = tabName
}

const reset = () => {
  userSettingsStore.primarySettings.folder = userSettingsStore.newRootFolder
  userSettingsStore.newRootFolder = ""
  userSettingsStore.primarySettings.lastOpenedFolder = ""
  userSettingsStore.isValidBridgePath = true
  userSettingsStore.isValidPhotoshopPath = true
}

const save = async () => {
  reset()
  userSettingsStore.saveSettings()
  emit("cancel")
}

const saveAndRestart = () => {
  reset()
  userSettingsStore.saveSettings()
  ipcRenderer.send("restart-app")
}

const cancel = () => {
  reset()
  userSettingsStore.primarySettings = JSON.parse(settingsCopy.value)
  emit("cancel")
}
</script>

<style lang="scss" scoped>

</style>