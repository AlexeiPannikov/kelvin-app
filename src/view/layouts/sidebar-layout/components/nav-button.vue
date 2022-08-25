<template>
  <v-list-item class="d-flex align-center justify-center border-b"
               width="79"
               height="79"
               :to="{name: props.pathName}"
  >
    <div class="bg-white icon-wrap">
      <v-icon color="main-content-back" size="20">
        <slot></slot>
      </v-icon>
    </div>
  </v-list-item>
</template>

<script lang="ts" setup>

interface IProps {
  pathName: string
}

const props = withDefaults(defineProps<IProps>(), {
  pathName: ""
})
</script>

<style lang="scss" scoped>
.icon-wrap {
  width: 37px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: white;
}
</style>