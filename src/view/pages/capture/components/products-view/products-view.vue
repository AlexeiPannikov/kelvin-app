<template>
  <v-row class="fill-height">
    <v-col class="d-flex flex-column pb-0 fill-height">
      <product-selections class="mb-4">
      </product-selections>
      <barcode-scan v-if="!scanProductStore.confirmedProduct"
                    @scan="scanHandler"
      ></barcode-scan>
      <product-card v-else></product-card>
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

const scanHandler = () => {
  scanProductStore.getProductData()
  isOpenConfirmModal.value = true
}
</script>

<style lang="scss" scoped>

</style>