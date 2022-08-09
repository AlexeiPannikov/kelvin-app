<template>
  <v-text-field class="ui-search"
                density="compact"
                hide-details
                variant="outlined"
                label="SEARCH"
                single-line
                prepend-inner-icon="mdi-magnify"
  >
  </v-text-field>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.ui-search {
  &:deep(.v-field) {
    width: 120px;
    transition: width 0.15s ease-in-out;
  }
  &:deep(.v-field--active) {
    width: 300px;
  }
}
</style>