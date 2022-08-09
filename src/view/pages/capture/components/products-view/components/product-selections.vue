<template>
<div class="d-flex align-center">
  <div class="rounded-circle bg-grey-lighten-1 px-2 py-2 mr-4">
    <v-icon color="grey-darken-4" size="40">mdi-upload</v-icon>
  </div>
  <v-menu
      v-model="isOpenMenu"
  >
    <template v-slot:activator="{ props }">
      <v-btn
          v-bind="props"
          :append-icon="isOpenMenu ? 'mdi-chevron-up' : 'mdi-chevron-down'"
      >
        SELECTIONS
      </v-btn>
    </template>

    <v-card min-width="300">

    </v-card>
  </v-menu>
</div>
</template>

<script lang="ts" setup>
import {ref} from "vue";

const isOpenMenu = ref(false)
</script>

<style lang="scss" scoped>

</style>