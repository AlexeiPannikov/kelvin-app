<template>
  <v-app full-height>
    <sidebar-layout></sidebar-layout>
    <header-layout></header-layout>
    <v-main>
      <v-container fluid class="bg-main-content-back fill-height">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import HeaderLayout from "./header-layout.vue";
import SidebarLayout from "./sidebar-layout/sidebar-layout.vue";
</script>

<style lang="scss">

</style>
