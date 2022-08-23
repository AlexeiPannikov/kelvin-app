<template>
  <div class="tree-item-wrap">
    <div class="tree-item pointer rounded"
         :class="{expanded: props.item.isExpanded, selected: props.item.isSelected}"
         @click.stop="select"
    >
      <div class="d-flex align-center">
        <div style="width: 20px; height: 20px" class="d-flex align-center justify-center mr-2">
          <v-icon v-if="props.item.children.length"
                  @click.stop="toggleExpand"
          >{{
              props.item.isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'
            }}
          </v-icon>
        </div>
        <span>{{ props.item.name }}</span>
      </div>
    </div>

    <ui-tree-item v-if="props.item.isExpanded"
                  v-for="child in props.item.children"
                  :key="child.id"
                  :item="child"
                  class="ml-3"
                  @select="childSelectHandler"
    ></ui-tree-item>
  </div>
</template>

<script lang="ts" setup>
import {TreeItem} from "./models/TreeItem";

interface IProps {
  item: TreeItem
}

const props = withDefaults(defineProps<IProps>(), {
  item: () => new TreeItem()
})

const emit = defineEmits<{
  (e: "select", item: TreeItem): void
}>()

const toggleExpand = () => {
  props.item.toggleExpand()
}

const select = () => {
  emit("select", props.item.selectItem())
}

const childSelectHandler = (item: TreeItem) => {
  emit("select", item)
}
</script>

<style lang="scss" scoped>
.tree-item {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  transition: color 0.1s ease-in-out;

  &:hover {
    color: rgba(255, 255, 255, 1);
  }
}

.expanded {

}

.selected {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>