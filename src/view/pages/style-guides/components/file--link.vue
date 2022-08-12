<template>
  <div class="d-flex align-center file pointer"
  >
    <v-icon>mdi-file</v-icon>
    <div class="text-decoration-underline description ml-1"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.file {
  max-width: max-content;

  &:deep(.v-icon) {
    opacity: 0.6;
    transition: opacity 0.1s ease-in-out;
  }

  &:hover:deep(.v-icon) {
    opacity: 1;
  }
}
</style>
