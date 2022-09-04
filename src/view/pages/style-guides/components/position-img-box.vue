<template>
  <div>
    <div class="text-uppercase mb-2">{{ props.position.name }}</div>
    <div class="position-relative">
      <v-img :src="props.position.coverFile.url"
             aspect-ratio="1"
             class="bg-grey"
             @dblclick="openImage(props.position.coverFile.url)"
      ></v-img>
      <div v-if="isOpenDescription || isOpenFiles" class="position-absolute overlay px-4 py-4">
        <template v-if="isOpenDescription">
          <div>DESCRIPTION</div>
          <div v-html="props.position.description"></div>
        </template>
        <template v-if="isOpenFiles">
          <div>FILES</div>
          <file-link v-for="file in props.position.filesInner"
                     @click="openInBrowser(file.url)"
          >{{ file.original_name }}
          </file-link>
        </template>
      </div>
    </div>
    <div class="mt-2 description d-flex align-center justify-space-between">
      <div>
        {{ props.position.is_optional ? "(Optional)" : "" }}
        {{ props.position.photography.minShots }}-{{ props.position.photography.maxShots > 0 ? props.position.photography.maxShots : "ထ" }}
      </div>
      <div class="d-flex align-center actions">
        <div @click="openDescription"
             class="mr-2 pointer"
             :class="{active: isOpenDescription}"
             v-if="props.position.description"
        >Description
        </div>
        <div @click="openFiles"
             class="pointer"
             :class="{active: isOpenFiles}"
             v-if="props.position.filesInner.length"
        >Files
        </div>
      </div>
    </div>

    <ui-modal-fullscreen-image-crop :file-list="[selectedImage]"
                                    v-if="isOpenModal"
                                    @close="isOpenModal = false"
    >
    </ui-modal-fullscreen-image-crop>
  </div>
</template>

<script lang="ts" setup>
import {Position} from "../../../../api/models/requests/StyleGuides/Position";
import UiModalFullscreenImageCrop from "../../../components/modal-windows/ui-modal-fullscreen-image-crop.vue";
import {reactive, ref} from "vue";
import {ImageModel} from "../../capture/components/files-view/ImageModel";
import FileLink from "./file--link.vue";
import {openInBrowser} from "../../../../functions/openInBrowser"

interface IProps {
  position: Position | any
}

const props = withDefaults(defineProps<IProps>(), {
  position: () => new Position()
})

const selectedImage = reactive(new ImageModel())
const isOpenModal = ref(false)
const isOpenDescription = ref(false)
const isOpenFiles = ref(false)

const openImage = (url: string) => {
  selectedImage.path = url
  selectedImage.name = url
  isOpenModal.value = true
}

const openDescription = () => {
  isOpenFiles.value = false
  isOpenDescription.value = !isOpenDescription.value
}

const openFiles = () => {
  isOpenDescription.value = false
  isOpenFiles.value = !isOpenFiles.value
}
</script>

<style lang="scss" scoped>
.overlay {
  bottom: 0;
  left: 0;
  min-height: 80px;
  max-height: 100%;
  width: 100%;
  background-color: rgb(0, 0, 0, 0.9);
  overflow-y: auto;
}

.actions > div {
  opacity: 0.6;
  transition: opacity 0.1s ease-in-out;

  &:hover {
    opacity: 1;
  }
}

.active {
  opacity: 1 !important;
}
</style>