<template>
  <v-btn
    class="white-button"
    :size="props.size"
    color="white"
    :disabled="props.disabled || props.isLoading"
    flat
  >
    <slot />
  </v-btn>
</template>

<script lang="ts" setup>
interface IProps {
  size?: string | number;
  disabled?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  size: "default",
  disabled: false,
});
</script>

<style lang="scss" scoped>

</style>
