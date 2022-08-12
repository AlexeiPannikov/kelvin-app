<template>
  <div style="width: 200px">
    <v-img v-if="!file.cropImage" @dblclick="emit('dblclick')" class="image" width="200" aspect-ratio="1" :src="props.file.path"></v-img>
    <v-img v-else @dblclick="emit('dblclick')" class="image" width="200" :src="props.file.cropImage"></v-img>
    <div class="text-center mt-2" style="font-size: 12px">{{ props.file.name }}</div>
  </div>
</template>

<script lang="ts" setup>

import {FileModel} from "./FileModel";

interface IProps {
  file: FileModel,
}

const props = withDefaults(defineProps<IProps>(), {
  file: () => new FileModel()
})

const emit = defineEmits(['dblclick'])
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