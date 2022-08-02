<template>
  <v-btn
    class="blue-button"
    :disabled="props.disabled || props.isLoading"
    :append-icon="appendIcon"
    :size="props.size"
    color="primary"
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

</style>
