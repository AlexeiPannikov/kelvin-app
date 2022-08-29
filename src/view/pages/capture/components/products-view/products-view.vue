<template>
  <v-row class="fill-height" no-gutters>
    <v-col class="d-flex flex-column pb-0 fill-height px-4 pt-4">
      <product-selections class="mb-4">
      </product-selections>
      <transition name="fade" appear>
        <barcode-scan v-if="!scanProductStore.confirmedProduct"
                      @scan="scanHandler"
        ></barcode-scan>
      </transition>
      <transition name="fade" appear>
        <product-card v-if="scanProductStore.confirmedProduct"></product-card>
      </transition>
    </v-col>
  </v-row>

  <confirm-modal v-model="isOpenConfirmModal"
                 @cancel="isOpenConfirmModal = false"
  ></confirm-modal>
</template>

<script lang="ts" setup>
import BarcodeScan from "./components/barcode-scan.vue";
import ProductSelections from "./components/product-selections.vue";
import {defineAsyncComponent, ref} from "vue";
import ProductCard from "./components/product-card/product-card.vue";
import {useScanProductStore} from "../../../../../store/ScanProductStore";

const scanProductStore = useScanProductStore()

const ConfirmModal = defineAsyncComponent(() => import("./components/modal-windows/confirm-modal/confirm-modal.vue"));

const isOpenConfirmModal = ref(false)

scanProductStore.checkOldProductsInStore()

const scanHandler = () => {
  scanProductStore.getProductData()
  isOpenConfirmModal.value = true
}
</script>

<style lang="scss" scoped>
.fade-enter-active {
  transition: all 0.7s ease;
}

.fade-enter {
  opacity: 0;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>