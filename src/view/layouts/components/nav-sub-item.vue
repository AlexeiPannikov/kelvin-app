<template>
  <router-link
    v-if="props.to"
    :to="props.to"
    class="nav-sub-item"
    :class="activeClass"
  >
    <div class="sub-item-name">
      <slot></slot>
    </div>
  </router-link>
  <div v-else class="nav-sub-item" :class="activeClass" @click="clickHandler">
    <div class="sub-item-name">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";

interface IProps {
  to?: {};
  disableCheckPathMatch?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  to: null,
  disableCheckPathMatch: false,
});

const emit = defineEmits<{
  (e: "click"): void;
  (e: "routePushResolve"): void;
}>();

const router = useRouter();
const route = useRoute();

const hasPath = computed(() => {
  if (props.disableCheckPathMatch) return;
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
.nav-sub-item {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 230px;
  padding: 14px 25px 14px 30px;
  border-left: 3px solid transparent;
  color: var(--v-theme-text-primary);
  font-weight: 500;
  white-space: nowrap;
  font-size: 13px;
  position: relative;
  cursor: pointer;
  transition: all 0.15s linear;
  text-decoration: none;

  &:hover {
    border-left-color: #499fff;
    background-color: #f8f8f8;
  }
}

.active {
  border-left-color: #499fff;
  background-color: #f8f8f8;
}
</style>
