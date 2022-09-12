<template>
  <div class="bg-black w-100 position-absolute d-flex align-center px-4"
       style="height: 36px; bottom: 0; left: 0; opacity: 0.4"
  >
    <template v-if="!props.withoutButtons">
      <v-tooltip location="top">
        <template #activator="{props}">
          <div class="icon-box pointer"
               :class="{active: isOpenedDirectories}"
               @click="openDirectories"
          >
            <v-icon size="20" v-bind="props">mdi-folder-multiple</v-icon>
          </div>
        </template>
        TOGGLE DIRECTORY TREE
      </v-tooltip>
      <v-spacer></v-spacer>
      <v-tooltip location="top">
        <template #activator="{props}">
          <div style="width: 150px">
            <v-slider
                v-model="filesViewStore.size"
                :min="100"
                :max="600"
                :step="100"
                hide-details
                thumb-size="10"
                color="white"
                track-size="4"
                density="compact"
                v-bind="props"
                @update:modelValue="sizeChangeHandler"
            ></v-slider>
          </div>
        </template>
        THUMBNAIL SIZE
      </v-tooltip>
    </template>
  </div>
</template>

<script lang="ts" setup>

import {ref} from "vue";
import {useFilesViewStore} from "../../../../store/FilesViewStore";

const props = defineProps({
  withoutButtons: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(["directories"])

const isOpenedDirectories = ref(false)
const filesViewStore = useFilesViewStore()

const openDirectories = () => {
  isOpenedDirectories.value = !isOpenedDirectories.value
  emit('directories')
}

const sizeChangeHandler = () => {
  filesViewStore.saveInLocalStorage()
}
</script>

<style lang="scss" scoped>
.icon-box {
  height: 36px;
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color, 0.1s ease-in-out;

  &:hover {
    background-color: rgba(94, 94, 94, 1);
  }
}

.active {
  background-color: rgba(94, 94, 94, 1);
}
</style>