<template>
  <div class="overflow-y-auto fill-height px-4">
    <v-row>
      <v-col v-for="(image, i) in transferStore.selectedTransfer?.allImages"
             :key="i"
      >
        <image-box :file="image"
                   @click="selectImage(i)"
                   @dblclick="openFullscreen(i)"
        >
        </image-box>
      </v-col>
    </v-row>

    <ui-modal-fullscreen-image-crop :file-list="transferStore.selectedTransfer?.allImages"
                                    :index="index"
                                    @close="isOpenFullscreen = false"
                                    v-if="isOpenFullscreen"
    ></ui-modal-fullscreen-image-crop>
  </div>
</template>

<script lang="ts" setup>
import ImageBox from "../../capture/components/files-view/image-box.vue";
import {useTransferStore} from "../../../../store/TransferStore";
import UiModalFullscreenImageCrop from "../../../components/modal-windows/ui-modal-fullscreen-image-crop.vue";
import {onMounted, ref} from "vue";

const transferStore = useTransferStore()
const index = ref(0)
const isOpenFullscreen = ref(false)

const openFullscreen = (i: number) => {
  index.value = i
  isOpenFullscreen.value = true
}

const selectImage = (idx: number) => {
  transferStore.selectedTransfer?.allImages.forEach((item, i) => item.isSelected = idx === i)
}
</script>

<style lang="scss" scoped>

</style>