<template>
  <v-row class="fill-height overflow-hidden" no-gutters>
    <v-col cols="4" class="border-e fill-height pb-0 position-relative">
      <style-guide-select></style-guide-select>
      <bottom-panel without-buttons
      >
      </bottom-panel>
    </v-col>
    <v-col cols="8" class="fill-height position-relative">
      <style-guide-detail></style-guide-detail>
      <bottom-panel without-buttons
      >
      </bottom-panel>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import StyleGuideSelect from "./components/style-guide-select.vue";
import StyleGuideDetail from "./components/style-guide-detail.vue";
import {useClientsStore} from "../../../store/ClientsStore";
import {useStyleGuidesStore} from "../../../store/StyleGuidesStore";
import {ref} from "vue";
import BottomPanel from "../../layouts/components/bottom-panel.vue";

const clientsStore = useClientsStore()
const styleGuidesStore = useStyleGuidesStore()

const getData = async () => {
  if (!styleGuidesStore.isFirstLoading) return
  const res = await clientsStore.getClients()
  if (res?.length) {
    clientsStore.selectedClientId = res[0].id
    await styleGuidesStore.getStyleGuides(clientsStore.selectedClientId)
    if (styleGuidesStore.styleGuides.length)
      await styleGuidesStore.viewStyleGuide(styleGuidesStore.styleGuides[0].uuid)
    styleGuidesStore.selectedShootingTypeUuid = styleGuidesStore.getStyleGuideProductionTypesSelectList[0]?.value
  }
  styleGuidesStore.isFirstLoading = false
}
getData()
</script>

<style lang="scss" scoped>

</style>