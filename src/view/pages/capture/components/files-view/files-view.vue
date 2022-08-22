<template>
  <div class="fill-height d-flex flex-column">
    <v-row class="flex-grow-0" justify="end" no-gutters>
      <v-col cols="auto">
        <ui-search></ui-search>
      </v-col>
    </v-row>
    <v-row class="flex-grow-0" no-gutters>
      <v-col>
        <div class="text-uppercase description">{{ watchedFolder }}</div>
        <div class="text-h4 text-uppercase">{{ endFolder.toLocaleUpperCase() }}</div>
      </v-col>
    </v-row>
    <v-row class="flex-wrap overflow-auto mt-2" v-click-outside="resetSelect">
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
import {onMounted, onUnmounted, ref} from "vue";
import {ipcRenderer} from "electron"
import {useCurrentUserStore} from "../../../../../store/CurrentUserStore";
import {PrimarySettings} from "../../../auth/models/PrimarySettings";
import * as fs from "fs";
import * as path from "path";
import {ImageModel} from "./ImageModel";
import UiModalFullscreenImageCrop from "../../../../components/modal-windows/ui-modal-fullscreen-image-crop.vue";
import {CropperResult} from "vue-advanced-cropper";
import ImageBox from "./image-box.vue";
import images from "./ImagesList";

const currentUserStore = useCurrentUserStore()
const watchedFolder = ref("")
const watchedFolderWithoutEnd = ref("")
const endFolder = ref("")
const isOpenModal = ref(false)
const fileIndex = ref(0)

const getWatchedFolder = async () => {
  const settings: PrimarySettings = await ipcRenderer.invoke("get-user-settings", currentUserStore.currentUser.id)
  watchedFolder.value = settings.folder
  const index = watchedFolder.value.lastIndexOf("\\")
  endFolder.value = watchedFolder.value.substring(index + 1, watchedFolder.value.length)
  watchedFolderWithoutEnd.value = watchedFolder.value.substring(0, index)
  await getFilesInFolder()
}
getWatchedFolder()

const getFilesInFolder = async () => {
  const files = fs.readdirSync(watchedFolder.value, {withFileTypes: true})
  const normalizedPath = path.normalize(watchedFolder.value)
  const pushFiles = () => {
    images.list.splice(0)
    for (const file of files) {
      if (file.isDirectory()) continue
      images.list.push(new ImageModel({path: normalizedPath + "/" + file.name, name: file.name}))
    }
  }
  pushFiles()
  fs.watch(normalizedPath, async () => pushFiles())
}

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