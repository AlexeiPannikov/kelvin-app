<template>
  <teleport to=".v-application">
    <transition name="fade" appear>
      <div class="overlay align-center justify-center d-flex overflow-hidden">
        <div v-if="fullscreenImage.currentImgIdx !== 0 && !fullscreenImage.hasNotStartWidth"
             @click="fullscreenImage.flipBack"
             class="position-absolute left-arrow">
          <v-icon>mdi-arrow-left</v-icon>
        </div>
        <div class="tools position-fixed d-flex">
          <div class="align-self-center d-flex justify-center flex-grow-1 ml-16">
            <ui-tabs :items="tabs"
                     height="20px"
                     padding="4px"
                     density="compact"
                     v-model="mode"
            >
            </ui-tabs>
          </div>
          <div class="d-flex align-center">
            <template v-if="mode === 'select'">
              <v-icon class="screen" color="white" @click="toggleFullscreen"
              >{{ isFullScreenBrowserMode ? "mdi-fullscreen-exit" : "mdi-fullscreen" }}
              </v-icon>
              <v-icon
                  color="white"
                  class="close"
                  @click="close"
              >mdi-close
              </v-icon>
            </template>
            <template v-else>
              <button-blue v-if="isChangedImage" size="small" @click="close" class="mr-2">
                Apply
              </button-blue>
              <button-white size="small" @click="resetCrop">
                Cancel
              </button-white>
            </template>
          </div>
        </div>
        <div class="position-absolute images-wrap d-flex"
        >
          <div class="d-inline-flex align-center image-wrap justify-center"
               v-for="item in props.fileList"
               :key="item.name"
          >
            <img
                v-if="mode === 'select'"
                :id="item.name"
                :src="item.path"
                alt="image"
                :style="{
            width: fullscreenImage.imgWidth,
            height: fullscreenImage.imgHeight,
            maxWidth: '100vw',
            maxHeight: '100vh',
          }"
            />
            <ui-crop-image v-if="mode === 'crop'"
                           :src="item.path"
                           @change="cropChange"
            >
            </ui-crop-image>
          </div>
        </div>
        <div v-if="fullscreenImage.currentImgIdx < props.fileList.length - 1 && !fullscreenImage.hasNotStartWidth"
             @click="fullscreenImage.flipForward"
             class="position-absolute right-arrow">
          <v-icon>mdi-arrow-right</v-icon>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import {defineProps, onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {FullscreenImage} from "./FullscreenImage";
import UiTabs from "../ui-tabs/ui-tabs.vue";
import UiCropImage from "../ui-crop-image/ui-crop-image.vue";
import {CropperResult} from "vue-advanced-cropper";
import ButtonWhite from "../buttons/button-white.vue";
import ButtonBlue from "../buttons/button-blue.vue";
import {FileModel} from "../../pages/capture/components/files-view/FileModel";

interface IProps {
  fileList: FileModel[]
  index: number
}

const props = withDefaults(defineProps<IProps>(), {
  fileList: () => ([]),
  index: 0
})

const emit = defineEmits(["close", "change", "resetCrop"]);

const fullscreenImage = reactive(new FullscreenImage());
const isFullScreenBrowserMode = ref(false)
const isChangedImage = ref(false)

const tabs = [
  {name: "select", icon: "mdi-cursor-default"},
  {name: "crop", icon: "mdi-crop"},
]

const mode = ref<"select" | "crop">("select")


watch(mode, () => {
  mode.value === "select" ?
      fullscreenImage.isStopResize = false :
      fullscreenImage.isStopResize = true
})

onMounted(() => {
  setTimeout(() => {
    const images: HTMLImageElement[] = []
    props.fileList.forEach(({name}) => {
      images.push(document.getElementById(name) as HTMLImageElement);
    })
    console.log(images)
    fullscreenImage.init(images, props.index);
  }, 20);
});

const toggleFullscreen = () => {
  isFullScreenBrowserMode.value = !isFullScreenBrowserMode.value;
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
};

const cropChange = (data: CropperResult) => {
  isChangedImage.value = true
  emit("change", data)
}

const close = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  }
  emit('close')
}

const resetCrop = () => {
  emit("resetCrop")
}

onUnmounted(() => fullscreenImage.unsubscribe());
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  z-index: 999999;
  width: 100vw;
  height: 100vh;
  background-color: black;

  .images-wrap {
    min-width: 100%;
    min-height: 100%;

    .image-wrap {
      width: 100vw;
      height: 100vh;
    }
  }

  .left-arrow, .right-arrow {
    top: 0;
    height: 100%;
    width: 40px;
    background-color: rgb(255, 255, 255, 0);
    transition: background-color 0.1s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    color: white;
    cursor: pointer;
  }

  .left-arrow {
    left: 0;

    &:hover {
      background-color: rgb(255, 255, 255, 0.2);
    }
  }

  .right-arrow {
    right: 0;

    &:hover {
      background-color: rgb(255, 255, 255, 0.2);
    }
  }
}

.tools {
  top: 20px;
  padding: 0 40px;
  align-items: center;
  justify-content: flex-end;
  z-index: 90000;
  display: flex;
  width: 100%;

  .close, .screen {
    cursor: pointer;
  }

  &:deep(.tab) {
    border: 0 !important;
    font-size: 12px !important;
  }

  &:deep(.tabs) {
    background-color: #1a1a1a !important;
    border: 0 !important;
    height: 31px !important;

    .selected-tab {
      background-color: #333333;
      color: rgb(var(--v-theme-primary));
    }

    .v-tab {
      height: 23px !important;
    }
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s linear;
}

.fade-enter-to {
  opacity: 1;
}
</style>
