<template>
  <div class="fill-height d-flex flex-column">
    <v-row class="flex-grow-0" justify="end" no-gutters>
      <v-col cols="auto">
        <ui-search></ui-search>
      </v-col>
    </v-row>
    <v-row class="flex-grow-0" no-gutters>
      <v-col>
        <div class="text-uppercase description">{{ userSettingsStore.selectedWithoutEndpoint }}</div>
        <div class="text-h4 text-uppercase">{{ userSettingsStore.endpoint?.toLocaleUpperCase() }}</div>
      </v-col>
    </v-row>
    <v-row class="flex-wrap overflow-auto mt-2 mb-12" v-click-outside="resetSelect">
      <template v-if="images.list.length">
        <v-col v-for="(file, i) in images.list"
               :key="file.name"
               cols="auto"
        >
          <image-box :file="file"
                     :id="file.uuid"
                     @dblclick="openModal(i)"
                     @click="selectFile($event, file.uuid)"
                     @mousedown.prevent="dragStart"
                     @mousemove="choiceInMotion($event, file.uuid)"
          ></image-box>
        </v-col>
      </template>
      <div v-else class="w-100 d-flex align-center justify-center">
        There are no photos in this directory
      </div>

      <ui-modal-fullscreen-image-crop v-if="isOpenModal"
                                      :file-list="images.list"
                                      :index="fileIndex"
                                      @change="cropChange"
                                      @reset-crop="resetCrop"
                                      @close="isOpenModal = false"
      ></ui-modal-fullscreen-image-crop>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import UiSearch from "../../../../components/search/ui-search.vue";
import {onUnmounted, ref} from "vue";
import {ImageModel} from "./ImageModel";
import UiModalFullscreenImageCrop from "../../../../components/modal-windows/ui-modal-fullscreen-image-crop.vue";
import {CropperResult} from "vue-advanced-cropper";
import ImageBox from "./image-box.vue";
import images from "./ImagesList";
import {useUserSettingsStore} from "../../../../../store/UserSettingsStore";

const userSettingsStore = useUserSettingsStore()
const isOpenModal = ref(false)
const fileIndex = ref(0)

const initFiles = async () => {
  await userSettingsStore.getFilesInFolder(({name, path}) => images.list.push(new ImageModel({
    path,
    name
  })), images.list)
}
initFiles()

const openModal = (index: number) => {
  fileIndex.value = index
  isOpenModal.value = true
}

const cropChange = (data: CropperResult) => {
  images.list[fileIndex.value].cropImage = data.canvas.toDataURL()
  images.list[fileIndex.value].cropCoords = data.coordinates
}

const resetCrop = () => {
  images.list[fileIndex.value].cropImage = null
  isOpenModal.value = false
}

const selectFile = (event: MouseEvent, uuid: string) => {
  images.selectFile(event, uuid)
}

const choiceInMotion = (event: MouseEvent, uuid: string) => {
  images.choiceInMotion(event, uuid)
}

const resetSelect = () => {
  images.resetSelect()
}

const dragStart = (e: MouseEvent) => {
  images.dragStart(e)
}

onUnmounted(() => images.unsubscribes.call(images))
</script>

<style lang="scss" scoped>
</style>