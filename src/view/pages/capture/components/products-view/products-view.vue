<template>
  <v-row>
    <v-col cols="12">
      <product-selections>
      </product-selections>
    </v-col>
    <v-col cols="12">
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

const scanHandler = (isManySamples: boolean) => {
  isOpenConfirmModal.value = true
}
</script>

<style lang="scss" scoped>

</style>