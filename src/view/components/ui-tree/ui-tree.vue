<template>
  <div class="ui-tree">
    <ui-tree-item v-for="item in tree.items"
                  :key="item.id"
                  :item="item"
                  @select="select"
    ></ui-tree-item>
  </div>
</template>

<script lang="ts" setup>
import UiTreeItem from "./ui-tree-item.vue";
import {Tree} from "./models/Tree";
import {TreeItem} from "./models/TreeItem";

interface IProps {
  tree: Tree
}

const props = withDefaults(defineProps<IProps>(), {
  tree: () => new Tree()
})

const emit = defineEmits<{
  (e: "select", data: TreeItem): void
}>()

const select = (item: TreeItem) => {
  if (!item) return
  props.tree.leaveOneSelected(item.id)
  emit("select", item)
}
</script>

<style lang="scss" scoped>

</style>