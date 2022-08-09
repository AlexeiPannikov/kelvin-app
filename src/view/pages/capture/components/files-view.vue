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
    <v-col v-for="file in filesInFolder" :key="file.name" cols="auto">
      <div>
        <v-img class="image" width="200" :src="file.path"></v-img>
        <div class="text-center mt-2" style="font-size: 12px">{{ file.name }}</div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import UiSearch from "../../../components/search/ui-search.vue";
import {computed, defineAsyncComponent, reactive, ref} from "vue";
import {ipcRenderer} from "electron"
import {useCurrentUserStore} from "../../../../store/CurrentUserStore";
import {PrimarySettings} from "../../auth/models/PrimarySettings";
import * as fs from "fs";
import * as path from "path";
import {FileModel} from "./FileModel";

const currentUserStore = useCurrentUserStore()
const watchedFolder = ref("")
const watchedFolderWithoutEnd = ref("")
const endFolder = ref("")
const filesInFolder = reactive(new Array<FileModel>())

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
  // const userId = currentUserStore.currentUser.id
  // const files = await ipcRenderer.invoke("get-images", userId)
  // console.log(files)
  const files = fs.readdirSync(watchedFolder.value)
  const normalizedPath = path.normalize(watchedFolder.value)
  filesInFolder.splice(0)
  for (const file of files) {
    filesInFolder.push(new FileModel({path: normalizedPath + "/" + file, name: file}))
  }
  fs.watch(normalizedPath, async (eventType, filename) => {
    await getFilesInFolder()
  })
}
</script>

<style lang="scss" scoped>
.image {
  opacity: 0.7;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
}
</style>