<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col cols="auto">
        <ui-select label="Select Client"
                   :items="clientsStore.clientsSelectList"
                   v-model="clientsStore.selectedClientId"
                   :loading="clientsStore.isLoadingClients"
        >
        </ui-select>
      </v-col>
      <v-col>
        <ui-search v-model="searchText"></ui-search>
      </v-col>
    </v-row>
    <v-row class="list-row">
      <v-col cols="12" class="position-relative fill-height pb-0">
        <ui-preloader contained :is-loading="styleGuidesStore.isLoadingStyleGuides">
          <v-list v-if="styleGuidesStore.styleGuides.length"
                  bg-color="main-content-back"
                  height="100%"
          >
            <v-list-item v-for="styleGuide in filteredStyleGuides"
                         class="border-t pb-0"
                         @click="selectStyleGuide(styleGuide.uuid)"
                         :active="styleGuidesStore.styleGuide.uuid === styleGuide.uuid"
            >
              <div class="d-flex align-center">
                <div class="d-flex align-center justify-center bg-white" style="width: 50px; height: 60px">
                  <v-img width="50" class="mr-0" :src="styleGuide.coverFile.url"></v-img>
                </div>
                <span class="pl-3 text-uppercase">{{ styleGuide.name }}</span>
              </div>
            </v-list-item>
          </v-list>
          <div v-else>
            No styleguides
          </div>
        </ui-preloader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import {useClientsStore} from "../../../../store/ClientsStore";
import {computed, ref, watch} from "vue";
import UiSearch from "../../../components/search/ui-search.vue";
import UiSelect from "../../../components/ui-select/ui-select.vue";
import {useStyleGuidesStore} from "../../../../store/StyleGuidesStore";
import UiPreloader from "../../../components/ui-preloader/ui-preloader.vue";
import {StyleGuide} from "../../../../api/models/responses/StyleGuides/StyleGuide";
import {useSearchFilter} from "../../../../functions/useSearch";

const clientsStore = useClientsStore()
const styleGuidesStore = useStyleGuidesStore()
const searchText = ref("")

const filteredStyleGuides = computed(() => useSearchFilter(searchText.value, styleGuidesStore.styleGuides, ["name"]))

watch(() => clientsStore.selectedClientId, async () => {
  if (styleGuidesStore.isFirstLoading) return
  styleGuidesStore.styleGuide = new StyleGuide()
  await styleGuidesStore.getStyleGuides(clientsStore.selectedClientId)
  if (styleGuidesStore.styleGuides.length) {
    await styleGuidesStore.viewStyleGuide(styleGuidesStore.styleGuides[0].uuid)
  }
})

const selectStyleGuide = async (uuid: string) => {
  if (styleGuidesStore.styleGuide.uuid === uuid) return
  await styleGuidesStore.viewStyleGuide(uuid)
  styleGuidesStore.selectedShootingTypeUuid = styleGuidesStore.getStyleGuideProductionTypesSelectList[0]?.value
}
</script>

<style lang="scss" scoped>
.list-row {
  height: calc(100% - 64px);
}
</style>