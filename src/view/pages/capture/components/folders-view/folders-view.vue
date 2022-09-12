<template>
  <div class="overflow-auto fill-height w-100">
    <div class="w-100 pt-4 px-4">
      <ui-tree :tree="foldersTree"
               @select="selectItem"
      >
      </ui-tree>
    </div>
  </div>
</template>

<script lang="ts" setup>
import UiTree from "../../../../components/ui-tree/ui-tree.vue";
import {reactive, ref} from "vue";
import {Tree} from "../../../../components/ui-tree/models/Tree";
import {TreeItem} from "../../../../components/ui-tree/models/TreeItem";
import fs from "fs";
import path from "path";
import {PrimarySettings} from "../../../../../store/models/PrimarySettings";
import {ipcRenderer} from "electron";
import {useCurrentUserStore} from "../../../../../store/CurrentUserStore";
import {IFolder, useUserSettingsStore} from "../../../../../store/UserSettingsStore";
import images from "../files-view/ImagesList";
import {ImageModel} from "../files-view/ImageModel";
import {useFilesViewStore} from "../../../../../store/FilesViewStore";

const userSettingsStore = useUserSettingsStore()
const filesViewStore = useFilesViewStore()
const selectedItem = ref(new TreeItem())
const foldersTree = reactive(new Tree())

const initFolders = async () => {
  const folder = await filesViewStore.getFoldersTree(filesViewStore.rootFolder)
  foldersTree.items[0] = new TreeItem({
    name: folder.name,
    value: folder.path,
    type: "folder",
    isSelected: true
  })
  selectedItem.value = foldersTree.items[0]
  const initChildrenFolders = (treeItems: TreeItem[], folderItems: IFolder[]) => {
    if (!folderItems) return
    treeItems.splice(0)
    for (const {children, name, path} of folderItems) {
      const newItem = new TreeItem({
        name,
        value: path,
        type: "folder",
      })
      if (path === filesViewStore.selectedFolder) {
        newItem.selectItem()
        foldersTree.leaveOneSelected(newItem.id)
        selectedItem.value = newItem
      }
      treeItems.push(newItem)
      initChildrenFolders(treeItems.at(-1).children, children)
    }
  }
  initChildrenFolders(foldersTree.items[0].children, folder.children)
  foldersTree.expandToSelected()
}
initFolders()
fs.watch(filesViewStore.rootFolder, {recursive: true}, () => initFolders())

const selectItem = async (item: TreeItem) => {
  selectedItem.value = item
  filesViewStore.selectedFolder = item.value
  filesViewStore.parseFolder()
  userSettingsStore.primarySettings.lastOpenedFolder = item.value
  userSettingsStore.saveSettings()
  await filesViewStore.initFilesInFolder()
}
</script>

<style lang="scss" scoped>

</style>