<template>
  <v-row>
    <v-col cols="12">
      <product-selections>
      </product-selections>
    </v-col>
    <v-col cols="12">
      <barcode-scan @scan="scanHandler"
      ></barcode-scan>
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

const ConfirmModal = defineAsyncComponent(() => import("./components/modal-windows/confirm-modal.vue"));

const isOpenConfirmModal = ref(false)

const scanHandler = (isManySamples: boolean) => {
  isOpenConfirmModal.value = true
}
</script>

<style lang="scss" scoped>

</style>