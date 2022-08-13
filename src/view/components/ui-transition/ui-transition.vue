<template>
  <transition name="fade" appear>
    <slot></slot>
  </transition>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-in-out;
}

.fade-enter-to {
  opacity: 1;
}
</style>