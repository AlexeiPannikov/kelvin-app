<template>
  <v-row class="fill-height">
    <v-col cols="8" class="border-e">
      <files-view></files-view>
    </v-col>
    <v-col cols="4">
      <products-view></products-view>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import FilesView from "./components/files-view/files-view.vue";
import ProductsView from "./components/products-view/products-view.vue";
</script>
<style lang="scss" scoped>

</style>