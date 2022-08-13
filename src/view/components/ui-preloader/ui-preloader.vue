<template>
  <v-overlay
      :model-value="props.isLoading"
      :contained="props.contained"
      class="align-center justify-center preloader-overlay"
      :scrim="overlayScrimBack"
      :transition="props.transition"
  >
    <v-progress-circular
        color="primary"
        indeterminate
        :size="props.size"
    ></v-progress-circular>
  </v-overlay>
  <ui-transition>
    <slot v-if="!props.isLoading"></slot>
  </ui-transition>
</template>

<script lang="ts" setup>
import UiTransition from "../ui-transition/ui-transition.vue";

const props = defineProps({
  isLoading: {
    type: Boolean,
  },
  contained: {
    type: Boolean,
  },
  size: {
    type: String,
    default: "64",
  },
  overlayScrimBack: {
    type: String,
    default: "rgb(255, 255, 255, 0)",
  },
  transition: {
    type: String,
    default: "progress",
  },
});
</script>

<style lang="scss">
body {
  --v-theme-on-surface: v-bind(overlayScrimBack);
}

.preloader-overlay {
  & .v-overlay__scrim {
    opacity: 1 !important;
    //background-color: v-bind(overlayScrimBack) !important;
  }
}

.progress-enter-from,
.progress-leave-to {
  opacity: 0;
  transform: translateY(-60px);
}

.progress-enter-active,
.progress-leave-active {
  transition: all 0.1s ease-in-out;
}

.progress-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
