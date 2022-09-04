<template>
  <div>
    <v-card flat>
      <v-card-title>
        External Applications
      </v-card-title>
      <v-card-subtitle class="text-wrap">
        Certain functions in Kelvin use Adobe Photoshop and Adobe Bridge. Please point Kelvin to the right application
        paths if you wish to use these functions.
      </v-card-subtitle>
      <select-external-applications
      ></select-external-applications>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import SelectExternalApplications from "../../../../pages/components/select-external-applications.vue";
</script>

<style lang="scss" scoped>

</style>