<template>
  <v-tooltip v-if="componentProps.isVisible" location="top">
    <template #activator="{ props }">
      <transition name="icon" appear>
        <div class="d-inline-block">
          <v-icon
              v-if="!isCopied"
              v-bind="props"
              color="primary"
              size="15"
              icon="mdi-content-copy"
              class="ml-1 copy-icon"
              @click.stop="copy"
          >
          </v-icon>
          <v-icon
              v-if="isCopied"
              v-bind="props"
              size="15"
              icon="mdi-check"
              class="ml-1 copy-icon"
          >
          </v-icon>
        </div>
      </transition>
    </template>
    <span>{{ isCopied ? "Copied!" : "Copy" }}</span>
  </v-tooltip>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

const componentProps = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

const isCopied = ref(false);

watch(
    () => componentProps.isVisible,
    () => {
      if (!componentProps.isVisible) {
        isCopied.value = false;
      }
    }
);

const copy = () => {
  isCopied.value = true;
  navigator.clipboard.writeText(componentProps.text);
};
</script>

<style lang="scss" scoped>
.icon-leave-active,
.icon-enter-active {
  transition: all 0.1s linear;
}

.icon-enter-from,
.icon-leave-to {
  transform: translateX(-10px);
}

.icon-enter-to {
  transform: translateX(0);
}
.copy-icon {
  cursor: pointer;
  opacity: 0.8;

  &:active {
    opacity: 1;
  }
}
</style>
