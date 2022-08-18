<template>
  <v-card class="fill-height overflow-y-auto bg-transparent"
  >
    <template v-for="(shootingTypes, i) in scanProductStore.confirmedProduct.styleGuide.shootingTypes"
              :key="i"
    >
      <template v-if="shootingTypes.production_type_uuid === studioStore.selectedProductionTypeUuid">
        <v-card-item v-for="position in shootingTypes.positions"
                     :key="position.id"
                     class="pl-0 py-0"
        >
          <div class="d-flex bg-grey-darken-3">
            <div style="z-index: 5">
              <v-img width="160"
                     :src="position.coverFile.url"
                     aspect-ratio="1"
                     class="bg-black"
              ></v-img>
            </div>
            <div class="d-flex flex-grow-1">
              <div class="d-flex justify-space-between main-zone">
                <div class="d-flex px-2 py-2 align-center align-self-start">
                  <span style="font-size: 14px" class="text-uppercase font-weight-bold">{{ position.name }}</span>
                  <span v-if="position.photography.minShots || position.photography.maxShots"
                  >
                {{ position.photography.minShots }} - {{ position.photography.maxShots }}
                  </span>
                </div>
              </div>
              <div class="flex-grow-0 alts-zone d-flex py-2">
                <div class="align-self-end d-flex justify-center w-100">
                  <v-chip >ALTS</v-chip>
                </div>
              </div>
            </div>
          </div>
        </v-card-item>
      </template>
    </template>
  </v-card>
</template>

<script lang="ts" setup>
import {useScanProductStore} from "../../../../../../../../../store/ScanProductStore";
import {useStudioStore} from "../../../../../../../../../store/StudioStore";

const scanProductStore = useScanProductStore()
const studioStore = useStudioStore()
</script>

<style lang="scss" scoped>
.main-zone {
  position: relative;
  flex: 1 0 100px;
  box-shadow: 1px 0 12px 0px #000000;
  z-index: 3;
}

.alts-zone {
  flex: 1 0 100px;
  z-index: 1;
}
</style>