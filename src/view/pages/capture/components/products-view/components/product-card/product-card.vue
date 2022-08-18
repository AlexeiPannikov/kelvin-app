<template>
  <div class="d-flex flex-column flex-grow-1 fill-height overflow-y-auto">
    <product-info-block>
    </product-info-block>
    <product-drop-zone class="mt-4">
    </product-drop-zone>
  </div>
</template>

<script lang="ts" setup>

import ProductInfoBlock from "./components/product-info-block/product-info-block.vue";
import ProductDropZone from "./components/product-drop-zone/product-drop-zone.vue";
</script>

<style lang="scss" scoped>

</style>