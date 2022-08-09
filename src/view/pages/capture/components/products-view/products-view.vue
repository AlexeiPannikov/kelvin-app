<template>
  <v-row>
    <v-col cols="12">
      <product-selections>
      </product-selections>
    </v-col>
    <v-col cols="12">
      <barcode-scan></barcode-scan>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>

import BarcodeScan from "./components/barcode-scan.vue";
import ProductSelections from "./components/product-selections.vue";
</script>

<style lang="scss" scoped>

</style>