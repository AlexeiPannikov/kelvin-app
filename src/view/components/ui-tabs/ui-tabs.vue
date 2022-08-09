<template>
  <v-tabs class="tabs" :style="{padding: props.padding}">
    <v-tab
        v-for="tab in props.items"
        :key="tab.name"
        class="tab"
        hide-slider
        selected-class="selected-tab"
        :value="tab.value || tab.name"
        :to="tab.to"
    >
      <v-icon v-if="tab.icon" class="mr-2">{{ tab.icon }}</v-icon>
      {{ tab.name }}
    </v-tab>
  </v-tabs>
</template>

<script lang="ts" setup>
import {defineProps} from "vue";

interface IItem {
  name: string;
  value?: string;
  to?: {};
  icon?: string;
}

interface IProps {
  items: IItem[];
  height?: string;
  padding?: string
}

const props = withDefaults(defineProps<IProps>(), {
  items: () => new Array<IItem>(),
  height: "60px",
  padding: "8px",
});
</script>

<style lang="scss" scoped>
.tabs {
  border: 1px solid lightgray;
  border-radius: 4px;
  height: v-bind(height) !important;
  width: max-content;

  .tab {
    border-radius: 4px !important;
    border: 1px solid lightgray;

    &:not(:last-child) {
      margin-right: 8px;
    }
  }

  .selected-tab {
    background-color: rgb(var(--v-theme-primary));
    color: white;
  }
}
</style>
