<template>
  <div class="fill-height d-flex flex-column">
    <v-row class="flex-grow-0" justify="end" no-gutters>
      <v-col cols="auto">
        <ui-search v-model="searchText"></ui-search>
      </v-col>
    </v-row>
    <v-row class="flex-grow-0" no-gutters>
      <v-col>
        <div class="text-uppercase description">{{ filesViewStore.selectedWithoutEndpoint }}</div>
        <div class="text-h4 text-uppercase">{{ filesViewStore.endpoint?.toLocaleUpperCase() }}</div>
      </v-col>
    </v-row>
    <v-row class="flex-wrap overflow-auto mt-2 mb-12" v-click-outside="resetSelect">
      <template v-if="images.list.length">
        <v-col v-for="(file, i) in filteredImagesList"
               :key="file.name"
               cols="auto"
        >
          <image-box :file="file"
                     :id="file.name"
                     :width="filesViewStore.size"
                     ref="imageBox"
                     @dblclick="openModal(i)"
                     @click="selectFile($event, file.name)"
                     @contextmenu="openContextMenu($event, file)"
                     @mousedown.prevent="dragStart"
                     @mousemove="choiceInMotion($event, file.name)"
                     v-click-outside="(e: PointerEvent) => unselectFiles(e, file)"
          >
          </image-box>
        </v-col>
      </template>
      <div v-if="!images.list.length" class="w-100 d-flex align-center justify-center">
        There are no photos in this directory
      </div>
      <div v-if="images.list.length && !filteredImagesList.length" class="w-100 d-flex align-center justify-center">
        Images not found
      </div>

      <ui-modal-fullscreen-image-crop v-if="isOpenModal"
                                      :file-list="images.list"
                                      :index="fileIndex"
                                      @change="cropChange"
                                      @reset-crop="resetCrop"
                                      @close="isOpenModal = false"
      ></ui-modal-fullscreen-image-crop>
    </v-row>

    <div class="context-menu position-fixed"
         v-show="isOpenContextMenu"
         ref="contextMenu"
    >
      <v-list density="compact" style="font-size: 13px">
        <v-list-item @click="openInExplorer">Show In Explorer</v-list-item>
        <v-list-item :disabled="!userSettingsStore.primarySettings.adobeApplications.ps"
                     @click="openPhotoshop"
        >
          Open In Adobe Photoshop
        </v-list-item>
        <v-list-item :disabled="!userSettingsStore.primarySettings.adobeApplications.br"
                     @click="openBridge"
        >
          Open In Adobe Bridge
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script lang="ts" setup>
import UiSearch from "../../../../components/search/ui-search.vue";
import {computed, onUnmounted, ref} from "vue";
import {ImageModel} from "./ImageModel";
import UiModalFullscreenImageCrop from "../../../../components/modal-windows/ui-modal-fullscreen-image-crop.vue";
import {CropperResult} from "vue-advanced-cropper";
import ImageBox from "./image-box.vue";
import images from "./ImagesList";
import {useUserSettingsStore} from "../../../../../store/UserSettingsStore";
import {useSearchFilter} from "../../../../../functions/useSearch";
import {ipcRenderer} from "electron"
import {useFilesViewStore} from "../../../../../store/FilesViewStore";

const userSettingsStore = useUserSettingsStore()
const filesViewStore = useFilesViewStore()
const isOpenModal = ref(false)
const fileIndex = ref(0)
const searchText = ref("")
const isOpenContextMenu = ref(false)
const imageBox = ref(null)
const contextMenu = ref(null)

const filteredImagesList = computed(() => useSearchFilter(searchText.value, images.list, ["name"]))
const selectedImages = computed(() => filteredImagesList.value.filter(({isSelected}) => isSelected))

const initFiles = async () => {
  await filesViewStore.initFilesInFolder()
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

const selectFile = (event: MouseEvent, name: string) => {
  images.selectFile(event, name)
  isOpenContextMenu.value = false
}

const choiceInMotion = (event: MouseEvent, name: string) => {
  images.choiceInMotion(event, name)
}

const resetSelect = () => {
  images.resetSelect()
}

const dragStart = (e: MouseEvent) => {
  images.dragStart(e)
}

const openContextMenu = (e: MouseEvent, file: ImageModel) => {
  images.list.forEach(item => item.name === file.name ? item.isSelected = true : item.isSelected = false)
  file.isSelected = true
  isOpenContextMenu.value = true
  const contextMenuEl = (contextMenu.value as HTMLDivElement)
  contextMenuEl.style.left = e.pageX + "px"
  contextMenuEl.style.top = e.pageY + "px"
  const clickOutsideHandler = (event: MouseEvent) => {
    const checkIsNotContains = (els: any) => {
      let rez = true
      for (const item of els) {
        if (item.$el.contains(event.target as Node)) rez = false
      }
      return rez
    }
    if (Array.isArray(imageBox.value)) {
      const rez = checkIsNotContains(imageBox.value)
      if (rez) closeContextMenu()
    } else {
      const rez = checkIsNotContains([imageBox.value])
      if (rez) closeContextMenu();
    }
  }
  document.onclick = clickOutsideHandler
  document.oncontextmenu = clickOutsideHandler
}

const closeContextMenu = () => {
  isOpenContextMenu.value = false
  document.onclick = null
  document.oncontextmenu = null
}

const openInExplorer = () => {
  ipcRenderer.send("show-in-explorer", selectedImages.value[0].path)
}

const unselectFiles = (e: PointerEvent, file: ImageModel) => {
  if (!e.ctrlKey)
    file.isSelected = false
}

const openPhotoshop = () => {
  ipcRenderer.send("run-child-app", userSettingsStore.primarySettings.adobeApplications.ps, [selectedImages.value[0].path])
}

const openBridge = () => {
  ipcRenderer.send("run-child-app", userSettingsStore.primarySettings.adobeApplications.br, [selectedImages.value[0].path])
}

onUnmounted(() => images.unsubscribes.call(images))
</script>

<style lang="scss" scoped>
</style>