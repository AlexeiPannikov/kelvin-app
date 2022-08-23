<template>
  <div class="bg-black w-100 position-absolute d-flex align-center px-4"
       style="height: 36px; bottom: 0; left: 0; opacity: 0.4"
  >
    <template v-if="!props.withoutButtons">
      <v-tooltip location="top">
        <template #activator="{props}">
          <div class="icon-box pointer" @click="emit('directories')">
            <v-icon size="20" v-bind="props">mdi-folder-multiple</v-icon>
          </div>
        </template>
        TOGGLE DIRECTORY TREE
      </v-tooltip>
    </template>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  withoutButtons: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(["directories"])
</script>

<style lang="scss" scoped>
.icon-box {
  height: 36px;
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color, 0.1s ease-in-out;

  &:hover {
    background-color: rgba(94, 94, 94, 1);
  }
}
</style>