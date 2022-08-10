<template>
  <v-row class="fill-height overflow-hidden">
    <v-col cols="4" class="border-e fill-height pb-0">
      <style-guide-select></style-guide-select>
    </v-col>
    <v-col cols="8">
      <style-guide-detail></style-guide-detail>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import StyleGuideSelect from "./components/style-guide-select.vue";
import StyleGuideDetail from "./components/style-guide-detail.vue";
</script>

<style lang="scss" scoped>

</style>