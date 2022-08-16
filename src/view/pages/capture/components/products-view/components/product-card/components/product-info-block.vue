<template>
  <div class="product-info-block rounded py-2 px-2">
    <v-tooltip>
      <template #activator="{props}">
        <v-icon class="position-absolute pointer rescan"
                color="primary"
                v-bind="props"
                @click="rescan"
        >mdi-autorenew
        </v-icon>
      </template>
      Rescan
    </v-tooltip>
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
         @click="isOpenConfirmProductModal = true"
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

  <confirm-product-modal v-model="isOpenConfirmProductModal"
                         @cancel="isOpenConfirmProductModal = false"
                         @confirm="isOpenConfirmProductModal = false"
  ></confirm-product-modal>
</template>

<script lang="ts" setup>
import {useScanProductStore} from "../../../../../../../../store/ScanProductStore";
import CopyTooltip from "../../../../../../../components/copy-tooltip/copy-tooltip.vue";
import {ref} from "vue";
import StyleGuideDetail from "./style-guide-detail.vue";
import ConfirmProductModal from "./confirm-product-modal.vue";

const scanProductStore = useScanProductStore()
const isVisibleCopyStyleGuide = ref(false)
const isVisibleCopyProduct = ref(false)
const isOpenStyleGuide = ref(false)
const isOpenConfirmProductModal = ref(false)

const rescan = () => {
  scanProductStore.confirmedProduct = null
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

.rescan {
  right: 25px;
  z-index: 10;
  opacity: 0.7;
  transition: opacity 0.1s ease-in-out;

  &:hover {
    opacity: 1;
  }
}
</style>