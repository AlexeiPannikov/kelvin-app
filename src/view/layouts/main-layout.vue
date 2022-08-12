<template>
  <v-app full-height>
    <sidebar-layout></sidebar-layout>
    <header-layout></header-layout>
    <v-main>
      <v-container fluid class="bg-main-content-back fill-height main-container">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import HeaderLayout from "./header-layout.vue";
import SidebarLayout from "./sidebar-layout/sidebar-layout.vue";
import {useClientsStore} from "../../store/ClientsStore";
import {useStyleGuidesStore} from "../../store/StyleGuidesStore";
import {useStudioStore} from "../../store/StudioStore";

const clientsStore = useClientsStore()
const styleGuidesStore = useStyleGuidesStore()
const studioStore = useStudioStore()

const getData = async () => {
  const res = await clientsStore.getClients()
  if (res?.length) {
    clientsStore.selectedClientId = res[0].id
    await styleGuidesStore.getStyleGuides(clientsStore.selectedClientId)
    await studioStore.getProductionTypes()
    if (styleGuidesStore.styleGuides.length)
      await styleGuidesStore.viewStyleGuide(styleGuidesStore.styleGuides[0].uuid)
    styleGuidesStore.selectedShootingTypeUuid = styleGuidesStore.getStyleGuideProductionTypesSelectList[0]?.value
  }
}
getData()
</script>

<style lang="scss">
.v-application {
  max-height: 100% !important;
}

.v-main {
  height: 100%;
}

.main-container {
  overflow: hidden;
}
</style>
