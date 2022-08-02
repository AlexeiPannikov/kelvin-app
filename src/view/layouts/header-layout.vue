<template>
  <v-app-bar flat color="main-content-back border-b">
    <v-row>
      <v-col>
        <h1 class="font-weight-medium">{{route.meta.title.toLocaleUpperCase()}}</h1>
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script lang="ts" setup>
import {useRoute} from "vue-router";
const route = useRoute()

</script>

<style lang="scss" scoped>

</style>
