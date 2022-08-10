<template>
  <div class="notifications-wrap">
    <div
      v-for="list in Notifications.sortedListByContainer"
      :key="list[0]"
      class="container"
      style="position: absolute"
      :style="{
        top: list[1][list[1].length - 1].options.top,
        right: list[1][list[1].length - 1].options.right,
        left: list[1][list[1].length - 1].options.left,
        bottom: list[1][list[1].length - 1].options.bottom,
      }"
    >
      <transition-group name="list">
        <notification-item
          v-for="item in list[1]"
          :key="item.id"
          class="notification"
          :item="item"
          @remove="removeNotification"
        >
        </notification-item>
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Notifications from "./models/Notifications";
import NotificationItem from "./notification-item.vue";

const removeNotification = (id: symbol) => {
  Notifications.removeNotification(id);
};
</script>

<style lang="scss" scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}

.notifications-wrap {
  position: fixed;
  top: 0;
  left: 0;
  max-height: calc(100% - 40px);
  z-index: 999999;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}
</style>
