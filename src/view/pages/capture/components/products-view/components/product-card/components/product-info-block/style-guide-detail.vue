<template>
  <v-container v-if="confirmedProduct.styleGuide.uuid" fluid class="position-relative fill-height">
    <div>
      <v-row>
        <v-col cols="12">
          <div class="d-flex">
            <div class="bg-white mr-4">
              <v-img width="150" aspect-ratio="1" :src="confirmedProduct.styleGuide.coverFile.url"></v-img>
            </div>
            <div>
              <h1 class="text-h5">
                {{ confirmedProduct.styleGuide.name.toLocaleUpperCase() }}
              </h1>
              <div class="description mt-2" v-html="confirmedProduct.styleGuide.description"></div>
              <file-link v-for="file in confirmedProduct.styleGuide.filesInner"
                         :key="file.url"
                         @click="openInBrowser(file.url)"
                         class="mt-2"
              >{{ file.original_name }}
              </file-link>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <h2 class="text-h6 text-uppercase">{{ productionTypeName }}</h2>
          <div v-html="confirmedProduct.styleGuide.description" class="description mt-2"></div>
          <file-link v-for="file in confirmedProduct.styleGuide.filesInner"
                     :key="file.url"
                     @click="openInBrowser(file.url)"
                     class="mt-2"
          >{{ file.original_name }}
          </file-link>
        </v-col>
        <v-col cols="12">
          <v-row>
            <v-col v-for="position in shootingType?.positions"
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
  </v-container>
</template>

<script lang="ts" setup>
import {useScanProductStore} from "../../../../../../../../../store/ScanProductStore";
import {reactive, ref, toRefs} from "vue";
import {useStudioStore} from "../../../../../../../../../store/StudioStore";
import FileLink from "../../../../../../../style-guides/components/file--link.vue";
import PositionImgBox from "../../../../../../../style-guides/components/position-img-box.vue";
import {openInBrowser} from "../../../../../../../../../functions/openInBrowser"

const scanProductStore = useScanProductStore()
const studioStore = useStudioStore()
const {confirmedProduct} = toRefs(scanProductStore)
const shootingType = reactive(scanProductStore.confirmedProduct.styleGuide.shootingTypes.find(({production_type_uuid}) => studioStore.selectedProductionTypeUuid === production_type_uuid))
const productionTypeName = ref(studioStore?.productionTypes.find(({uuid}) => shootingType?.production_type_uuid === uuid)?.name)
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