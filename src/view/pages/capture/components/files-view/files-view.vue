<template>
  <v-row justify="end">
    <v-col cols="auto">
      <ui-search></ui-search>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <div class="text-uppercase description">{{ watchedFolder }}</div>
      <div class="text-h4 text-uppercase">{{ endFolder.toLocaleUpperCase() }}</div>
    </v-col>
  </v-row>
  <v-row class="flex-wrap">
    <v-col v-for="(file, i) in filesInFolder" :key="file.name" cols="auto">
      <image-box :file="file"
                 @dblclick="openModal(i)"
      ></image-box>
    </v-col>

    <ui-modal-fullscreen-image-crop v-if="isOpenModal"
                                    :file-list="filesInFolder"
                                    :index="fileIndex"
                                    @change="cropChange"
                                    @reset-crop="resetCrop"
                                    @close="isOpenModal = false"
    ></ui-modal-fullscreen-image-crop>
  </v-row>
</template>

<script lang="ts" setup>
import UiSearch from "../../../../components/search/ui-search.vue";
import {computed, reactive, ref} from "vue";
import {ipcRenderer} from "electron"
import {useCurrentUserStore} from "../../../../../store/CurrentUserStore";
import {PrimarySettings} from "../../../auth/models/PrimarySettings";
import * as fs from "fs";
import * as path from "path";
import {FileModel} from "./FileModel";
import UiModalFullscreenImageCrop from "../../../../components/modal-windows/ui-modal-fullscreen-image-crop.vue";
import {CropperResult} from "vue-advanced-cropper";
import ImageBox from "./image-box.vue";

const currentUserStore = useCurrentUserStore()
const watchedFolder = ref("")
const watchedFolderWithoutEnd = ref("")
const endFolder = ref("")
const isOpenModal = ref(false)
const filesInFolder = reactive(new Array<FileModel>())
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
  const files = fs.readdirSync(watchedFolder.value)
  const normalizedPath = path.normalize(watchedFolder.value)
  const pushFiles = () => {
    filesInFolder.splice(0)
    for (const file of files) {
      filesInFolder.push(new FileModel({path: normalizedPath + "/" + file, name: file}))
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
  filesInFolder[fileIndex.value].cropImage = data.canvas.toDataURL()
  filesInFolder[fileIndex.value].cropCoords = data.coordinates
  console.log(filesInFolder[fileIndex.value])
}

const resetCrop = () => {
  filesInFolder[fileIndex.value].cropImage = null
  isOpenModal.value = false
}
</script>

<style lang="scss" scoped>
</style>