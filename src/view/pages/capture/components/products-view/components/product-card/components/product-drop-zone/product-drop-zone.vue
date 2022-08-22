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
                     v-click-outside="position.resetSelect?.bind(position)"
        >
          {{ position.errorMessage }}

          <div class="d-flex bg-grey-darken-3">
            <div style="z-index: 5">
              <v-img width="130"
                     :src="position.coverFile.url"
                     aspect-ratio="1"
                     class="bg-black"
              ></v-img>
            </div>
            <div class="d-flex flex-grow-1 overflow-hidden">

              <!--      MAIN ZONE        -->
              <div class="d-flex justify-space-between main-zone flex-column overflow-hidden">
                <div class="d-flex px-2 py-2 align-center align-self-start zone-header justify-space-between w-100"
                     style="font-size: 14px">
                  <span class="text-uppercase font-weight-bold">{{ position.name }}</span>
                  <div>
                    <span v-if="position.photography.minShots || position.photography.maxShots"
                    >
                {{ position.photography.minShots }} - {{ position.photography.maxShots }}
                  </span>
                    <v-icon class="ml-2"
                            :color="position.images.list.length < position.photography.minShots ? 'black' : 'green'"
                    >
                      {{
                        position.images.list.length < position.photography.minShots ? 'mdi-alert-circle' : 'mdi-check-circle-outline'
                      }}
                    </v-icon>
                  </div>
                </div>
                <div :id="position.id" class="d-flex flex-grow-1 py-2 px-2 overflow-x-auto">
                  <image-box v-for="img in position.images.list"
                             :id="img.uuid"
                             :file="img"
                             width="60"
                             class="align-self-center"
                             without-name
                             @click="position.images.selectFile($event, img.uuid)"
                             @mousedown.prevent="position.images.dragStart($event)"
                             @mousemove="choiceInMotion($event, img.uuid)"
                  ></image-box>
                </div>
              </div>

              <!--      ALTS ZONE        -->
              <div class="alts-zone d-flex flex-column position-relative overflow-hidden"
                   :class="{'dirty-alt-zone': position.altsImages.list.length}">
                <div class="d-flex px-2 py-2 align-center align-self-start zone-header">

                </div>
                <div :id="`alt-${position.id}`" class="d-flex flex-grow-1 py-2 px-2 overflow-x-auto">
                  <image-box v-for="img in position.altsImages.list"
                             :id="img.uuid"
                             :file="img"
                             width="60"
                             class="align-self-center"
                             without-name
                             @click="position.altsImages.selectFile($event, img.uuid)"
                             @mousedown.prevent="position.altsImages.dragStart($event)"
                             @mousemove="position.altsImages.choiceInMotion($event, img.uuid)"
                  ></image-box>
                </div>
                <div v-if="!position.altsImages.list.length" class="alts-chip d-flex justify-center w-100">
                  <v-chip>ALTS</v-chip>
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
import ImageBox from "../../../../../files-view/image-box.vue";
import {onMounted, onUnmounted, onUpdated, watch} from "vue";
import images from "../../../../../files-view/ImagesList";
import {Position} from "../../../../../../../../../api/models/requests/StyleGuides/Position";

const scanProductStore = useScanProductStore()
const studioStore = useStudioStore()

const choiceInMotion = (event: MouseEvent, uuid: string) => {
  position.images.choiceInMotion(event, uuid)
}

onMounted(() => {
  scanProductStore.confirmedProduct.styleGuide.shootingTypes.find(({production_type_uuid}) => studioStore.selectedProductionTypeUuid === production_type_uuid)?.positions
      .forEach(position => position?.subscribes())
})

onUnmounted(() => {
  scanProductStore.confirmedProduct?.styleGuide?.shootingTypes?.forEach(shootingType => {
    shootingType.positions.forEach(position => position?.unsubscribes())
  })
})
</script>

<style lang="scss" scoped>
.main-zone {
  position: relative;
  flex: 1 0 50%;
  box-shadow: 1px 0 12px 0 #000000;
  z-index: 3;
}

.alts-zone {
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 0%;
  min-width: 80px;
  z-index: 1;

  .alts-chip {
    position: absolute;
    bottom: 4px;
  }
}

.dirty-alt-zone {
  flex-basis: 50%;
}

.zone-header {
  height: 37px;
}
</style>