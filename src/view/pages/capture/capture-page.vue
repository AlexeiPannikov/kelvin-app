<template>
  <v-row class="fill-height overflow-hidden mb-0" no-gutters>
    <transition name="fade" appear>
      <v-col v-if="isVisibleDirectories" :cols="isVisibleDirectories ? 2 : 0"
             class="overflow-hidden position-relative border-e flex-grow-0"
      >
        <folders-view></folders-view>
        <bottom-panel without-buttons
        >
        </bottom-panel>
      </v-col>
    </transition>
    <v-col
        class="border-e fill-height overflow-hidden position-relative px-4 pt-4">
      <files-view></files-view>
      <bottom-panel @directories="isVisibleDirectories = !isVisibleDirectories"
      >
      </bottom-panel>
    </v-col>
    <v-col cols="4" class="pb-0">
      <products-view></products-view>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import FilesView from "./components/files-view/files-view.vue";
import ProductsView from "./components/products-view/products-view.vue";
import BottomPanel from "../../layouts/components/bottom-panel.vue";
import {ref} from "vue";
import FoldersView from "./components/folders-view/folders-view.vue";

const isVisibleDirectories = ref(false)

</script>
<style lang="scss" scoped>
.fade-enter-from,
.fade-leave-to {
  flex-basis: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: flex-basis 0.1s linear;
}

.fade-enter-to {
  flex-basis: 16.6666666667%;
}
</style>