<template>
  <v-menu
      v-model="isOpenSettingsMenu"
      location="end"
  >
    <template v-slot:activator="{ props }">
      <v-list-item class="pointer mt-3 d-flex align-center justify-center"
                   width="79"
                   height="79"
                   v-bind="props"
      >
        <v-icon color="white" size="30">mdi-dots-vertical</v-icon>
      </v-list-item>
    </template>
    <v-card class="ml-3"
            min-width="300"
            color="black"
    >
      <v-card-item class="border-b">
        <div class="d-flex">
          <v-avatar class="align-self-center"
                    color="grey"
          >
            <span class="text-white">{{ nameFirstLetters }}</span>
          </v-avatar>
          <div class="pl-4">
            <v-list-item-subtitle>role</v-list-item-subtitle>
            {{ currentUser.name }}
          </div>
        </div>
      </v-card-item>
      <v-card-actions>
        <v-list bg-color="black"
                density="compact"
                class="settings-list w-100"
        >
          <v-list-item @click="isOpenComputerLocation = true">Computer Location</v-list-item>
          <v-list-item @click="isOpenAppSettings = true">Settings</v-list-item>
          <v-list-item>Debug info</v-list-item>
          <v-list-item @click="logout">Logout</v-list-item>
        </v-list>
      </v-card-actions>
    </v-card>
  </v-menu>

  <computer-location-modal v-model="isOpenComputerLocation"
                           @cancel="isOpenComputerLocation = false"
  >
  </computer-location-modal>

  <app-settings v-model="isOpenAppSettings"
                @cancel="isOpenAppSettings = false"
  ></app-settings>
</template>

<script lang="ts" setup>
import {useCurrentUserStore} from "../../../../store/CurrentUserStore";
import {useFirstNameLetters} from "../../../../functions/useFirstNameLetters";
import {onMounted, ref, toRefs} from "vue";
import {useRouter} from "vue-router";
import ComputerLocationModal from "./computer-location-modal.vue";
import AppSettings from "./app-settings/app-settings.vue";
import {useUserSettingsStore} from "../../../../store/UserSettingsStore";
import {ipcRenderer} from "electron"

const currentUserStore = useCurrentUserStore()
const userSettingsStore = useUserSettingsStore()
const {currentUser} = toRefs(currentUserStore)
const isOpenSettingsMenu = ref(false)
const isOpenComputerLocation = ref(false)
const isOpenAppSettings = ref(false)
const nameFirstLetters = useFirstNameLetters(currentUser.value.name)
const router = useRouter()

const logout = async () => {
  const res = await currentUserStore.logout()
  if (res) {
    await router.push("/login")
  }
}

onMounted(async () => {
  await userSettingsStore.getSettings()
  if (!userSettingsStore.primarySettings.computerLocation.dontAskAgain) {
    setTimeout(() => isOpenComputerLocation.value = true, 2000)
  }
})

ipcRenderer.on("open-settings", () => isOpenAppSettings.value = true)
</script>

<style lang="scss" scoped>
.settings-list {
  font-size: 14px !important;
}
</style>