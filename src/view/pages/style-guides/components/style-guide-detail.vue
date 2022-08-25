<template>
  <div v-if="styleGuide.uuid" class="position-relative overflow-y-auto fill-height px-4 pt-4 pb-10">
    <ui-preloader :is-loading="styleGuidesStore.isLoadingStyleGuide" contained>
      <div>
        <v-row no-gutters>
          <v-col cols="12">
            <div class="d-flex">
              <div class="bg-white mr-4">
                <v-img width="150" aspect-ratio="1" :src="styleGuide.coverFile.url"></v-img>
              </div>
              <div>
                <h1 class="text-h5">
                  {{ styleGuide.name.toLocaleUpperCase() }}
                </h1>
                <div class="description mt-2" v-html="styleGuide.description"></div>
                <file-link v-for="file in styleGuide.filesInner"
                           :key="file.url"
                           @click="openInBrowser(file.url)"
                           class="mt-2"
                >{{ file.original_name }}
                </file-link>
              </div>
            </div>
          </v-col>
        </v-row>

        <v-row no-gutters justify="end">
          <v-col cols="auto">
            <ui-select :items="styleGuidesStore.getStyleGuideProductionTypesSelectList"
                       v-model="styleGuidesStore.selectedShootingTypeUuid"
            >
            </ui-select>
          </v-col>
          <v-col cols="12">
            <h2 class="text-h6 text-uppercase">{{ shootingTypeName?.toString().toLocaleUpperCase() }}</h2>
            <div v-html="styleGuide.description" class="description mt-2"></div>
            <file-link v-for="file in styleGuide.filesInner"
                       :key="file.url"
                       @click="openInBrowser(file.url)"
                       class="mt-2"
            >{{ file.original_name }}
            </file-link>
          </v-col>
          <v-col cols="12">
            <v-row no-gutters>
              <v-col v-for="position in positions"
                     :key="position.id"
                     cols="6"
              >
                <position-img-box :position="position"
                ></position-img-box>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </ui-preloader>
  </div>
</template>

<script lang="ts" setup>
import UiPreloader from "../../../components/ui-preloader/ui-preloader.vue";
import {useStyleGuidesStore} from "../../../../store/StyleGuidesStore";
import {computed, toRefs} from "vue";
import {openInBrowser} from "../../../../functions/openInBrowser"
import UiSelect from "../../../components/ui-select/ui-select.vue";
import {useStudioStore} from "../../../../store/StudioStore";
import FileLink from "./file--link.vue";
import PositionImgBox from "./position-img-box.vue";

const styleGuidesStore = useStyleGuidesStore()
const studioStore = useStudioStore()
const {styleGuide} = toRefs(styleGuidesStore)

const shootingTypeName = computed(() =>
    studioStore.productionTypes
        .find(({uuid}) => styleGuidesStore.selectedShootingTypeUuid === uuid)?.name)

const positions = computed(() => styleGuide.value.shootingTypes
    .find(({production_type_uuid}) => styleGuidesStore.selectedShootingTypeUuid === production_type_uuid)?.positions)
</script>

<style lang="scss" scoped>
.file {
  &:deep(.v-icon) {
    opacity: 0.6;
    transition: opacity 0.1s ease-in-out;
  }

  &:hover:deep(.v-icon) {
    opacity: 1;
  }
}
</style>