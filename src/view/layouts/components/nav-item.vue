<template>
  <div class="nav-item-wrap" @click="clickHandler">
    <router-link
      v-if="props.to"
      class="nav-item"
      :class="activeClass"
      :to="props.to"
    >
      <div class="item-name">
        <slot />
      </div>
    </router-link>
    <div v-else class="nav-item" :class="activeClass">
      <div class="item-name">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

interface IProps {
  to?: {};
}

const props = withDefaults(defineProps<IProps>(), {
  to: null,
});

const emit = defineEmits(["click", "routePushResolve"]);

const route = useRoute();
const router = useRouter();

const hasPath = computed(() => {
  return route.fullPath.includes(
    router?.getRoutes().find((item) => item.name === (props.to as any)?.name)
      ?.name as string
  );
});

const activeClass = computed(() => {
  if ((props.to && route.name === (props.to as any).name) || hasPath.value) {
    return "active";
  }
  return "";
});

const getColor = computed(() => {
  if (activeClass.value) {
    return "rgb(var(--v-theme-primary))";
  }
  return "";
});

const clickHandler = async () => {
  if (props.to) {
    try {
      const res = await router.push(props.to);
      if (!res) {
        emit("routePushResolve");
      }
    } catch (e) {
      console.log(e);
    }
  }
  emit("click");
};
</script>

<style lang="scss" scoped>
.nav-item-wrap {
  position: relative;
  height: 100%;

  .nav-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: max-content;
    padding: 0 25px;
    height: 100%;
    position: relative;
    cursor: pointer;
    text-decoration: none;

    &::before {
      content: "";
      display: block;
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 4px;
      background-color: transparent;
      transition: all 0.15s linear;
    }

    &:hover::before {
      background-color: #f2f2f2;
    }

    .item-name {
      color: rgb(var(--v-theme-text-primary));
      font-weight: 500;
      font-size: 14px;
      display: flex;
      align-items: center;
    }
  }

  .active::before {
    content: "";
    display: block;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 4px;
    background-color: v-bind(getColor);
    transition: all 0.15s linear;
  }

  .active:hover::before {
    background-color: v-bind(getColor);
  }
}
</style>
