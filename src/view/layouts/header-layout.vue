<template>
  <v-app-bar flat color="main-content-back border-b">
    <v-row>
      <v-col>
        <h1 class="font-weight-medium">{{ title }}</h1>
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script lang="ts" setup>
import {useRoute} from "vue-router";
import {computed} from "vue";

const route = useRoute()

const title = computed(() => {
  return (route.meta.title as string).toLocaleUpperCase()
})
</script>

<style lang="scss" scoped>

</style>
