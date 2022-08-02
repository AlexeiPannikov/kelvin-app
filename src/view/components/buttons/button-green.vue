<template>
  <v-btn
    class="green-button"
    :append-icon="appendIcon"
    :size="props.size"
    :disabled="props.disabled || props.isLoading"
    color="green"
    flat
  >
    <v-progress-circular
      v-if="props.isLoading"
      size="20"
      class="mr-3"
      indeterminate
      color="#fff"
    ></v-progress-circular>
    <slot></slot>
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
.green-button {
  color: white !important;

  &:hover {
    box-shadow: 0 0 10px rgba(0, 115, 11, 0.5);
  }

  &:active {
    background-color: rgb(var(--v-theme-green-darken)) !important;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.15) !important;
  }
}
</style>
