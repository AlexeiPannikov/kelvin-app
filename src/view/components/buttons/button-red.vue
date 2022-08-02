<template>
  <v-btn
    class="red-button"
    :disabled="props.disabled || props.isLoading"
    :append-icon="appendIcon"
    :size="props.size"
    color="warning"
    flat
  >
    <v-progress-circular
      v-if="props.isLoading"
      size="20"
      class="mr-3"
      indeterminate
      color="#fff"
    ></v-progress-circular>
    <slot />
  </v-btn>
</template>

<script lang="ts" setup>
interface IProps {
  size?: string | number;
  appendIcon?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  size: "default",
  appendIcon: null,
  disabled: false,
  isLoading: false,
});
</script>

<style lang="scss" scoped>
.red-button {
  &:hover {
    // box-shadow: 0px 0px 10px rgba(73, 159, 255, 0.5);
  }

  &:active {
    // background-color: rgb(var(--v-theme-primary-darken)) !important;
  }
}
</style>
