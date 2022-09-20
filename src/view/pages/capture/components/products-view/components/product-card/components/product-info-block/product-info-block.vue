<template>
  <div class="product-info-block rounded py-2 px-2">
    <div class="position-absolute d-flex align-center button-group">
      <v-btn v-if="!!tasksStore.taskData.task.is_rejected"
             size="small"
             class="mr-2"
             color="orange"
             flat
             @click="reshoot"
      >
        re-shoot
      </v-btn>
      <v-tooltip location="bottom">
        <template #activator="{props}">
          <v-icon class="pointer"
                  color="primary"
                  v-bind="props"
                  @click="rescan"
          >mdi-autorenew
          </v-icon>
        </template>
        Rescan
      </v-tooltip>
    </div>
    <div class="style-guide position-relative"
         @mouseover="isVisibleCopyStyleGuide = true"
         @mouseleave="isVisibleCopyStyleGuide = false"
         @click="isOpenStyleGuide = true"
    >
      <div class="title">STYLE GUIDE</div>
      <div class="text">
        {{ scanProductStore.confirmedProduct.styleGuide.name }}
        <copy-tooltip :is-visible="isVisibleCopyStyleGuide"
                      :text="scanProductStore.confirmedProduct.styleGuide.name"
        ></copy-tooltip>
      </div>
    </div>
    <div class="product mt-2 position-relative"
         @mouseover="isVisibleCopyProduct = true"
         @mouseleave="isVisibleCopyProduct = false"
         @click="openConfirmModal"
    >
      <div class="title">PRODUCT</div>
      <div class="text">
        {{ scanProductStore.confirmedProduct.product.product_code }}
        <copy-tooltip :is-visible="isVisibleCopyProduct"
                      :text="scanProductStore.confirmedProduct.product.product_code"
        ></copy-tooltip>
      </div>
    </div>
  </div>
  <v-navigation-drawer v-model="isOpenStyleGuide"
                       location="right"
                       temporary
                       width="600"
  >
    <style-guide-detail></style-guide-detail>
  </v-navigation-drawer>

  <confirm-modal v-model="isOpenConfirmProductModal"
                 @cancel="isOpenConfirmProductModal = false"
                 view-mode
  ></confirm-modal>

  <re-shoot-modal v-model="isOpenReShootModal"
                  @close="closeReShoot"
  ></re-shoot-modal>
</template>

<script lang="ts" setup>
import {useScanProductStore} from "../../../../../../../../../store/ScanProductStore";
import CopyTooltip from "../../../../../../../../components/copy-tooltip/copy-tooltip.vue";
import {computed, ref} from "vue";
import StyleGuideDetail from "./style-guide-detail.vue";
import ConfirmModal from "../../../modal-windows/confirm-modal/confirm-modal.vue";
import {useStudioStore} from "../../../../../../../../../store/StudioStore";
import {useTasksStore} from "../../../../../../../../../store/TasksStore";
import ReShootModal from "./re-shoot-modal.vue";

const scanProductStore = useScanProductStore()
const tasksStore = useTasksStore()
const isVisibleCopyStyleGuide = ref(false)
const isVisibleCopyProduct = ref(false)
const isOpenStyleGuide = ref(false)
const isOpenConfirmProductModal = ref(false)
const isOpenReShootModal = ref(false)
const studioStore = useStudioStore()

const rescan = () => {
  scanProductStore.confirmedProduct = null
}

const reshoot = async () => {
  isOpenReShootModal.value = true
}

const closeReShoot = () => {
  isOpenReShootModal.value = false
  // tasksStore.$reset()
}

const openConfirmModal = () => {
  scanProductStore.initProductFromConfirmedProduct()
  isOpenConfirmProductModal.value = true
}
</script>

<style lang="scss" scoped>
.product-info-block {
  border: 1px solid rgb(var(--v-theme-primary));
  background-color: rgb(var(--v-theme-primary), 0.2);
}

.style-guide, .product {
  cursor: pointer;
  width: max-content;

  .title {
    font-size: 12px;
    font-weight: bold;
    opacity: 0.7;
    transition: opacity 0.1s ease-in-out;
    color: rgb(var(--v-theme-primary));
  }

  .text {
    font-size: 18px;
  }
}

.style-guide:hover, .product:hover {
  .title {
    opacity: 1;
  }
}

.button-group {
  right: 25px;
  z-index: 10;
  opacity: 0.7;
  transition: opacity 0.1s ease-in-out;

  &:hover {
    opacity: 1;
  }
}
</style>