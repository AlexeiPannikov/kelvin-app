<template>
  <div :style="{width: props.width + 'px'}"
       :class="{active: file.isSelected}"
       class="image-box position-relative"
  >
    <v-img v-if="!file.cropImage"
           @dblclick="emit('dblclick')"
           class="image"
           :width="width"
           aspect-ratio="1"
           :src="file.path"
    ></v-img>
    <v-img v-else @dblclick="emit('dblclick')" class="image" :width="width + 'px'"
           :src="file.cropImage"></v-img>
    <div v-if="!withoutName" class="text-center mt-2" style="font-size: 12px">{{ file.name }}</div>
  </div>
</template>

<script lang="ts" setup>
import {ImageModel} from "./ImageModel";

interface IProps {
  file: ImageModel,
  width?: string | number,
  withoutName?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  file: () => new ImageModel(),
  width: 200,
  withoutName: false
})

const emit = defineEmits(['dblclick'])

</script>

<style lang="scss" scoped>
.image {
  //opacity: 0.7;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
}

.image-box {
  border: 2px solid transparent;
}

.active {
  border-color: rgb(var(--v-theme-primary));
}
</style>