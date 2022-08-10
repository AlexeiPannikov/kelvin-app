<template>
  <div
    class="notification"
    :class="getClass(props.item.type)"
    :style="{ background: props.item.options.backgroundColor }"
  >
    <div :style="{ color: props.item.options.textColor }">
      {{ props.item.message }}
    </div>
    <div
      v-show="props.item.options.isCloseButton"
      class="close"
      :style="{ background: props.item.options.closeIconBackgroundColor }"
      @click="removeNotification"
    >
      <v-icon :color="props.item.options.closeIconColor">mdi-close</v-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { NotificationModel } from "./models/NotificationModel";
import { NotificationTypesEnum } from "./models/NotificationTypesEnum";

interface IProps {
  item: NotificationModel;
}

const props = withDefaults(defineProps<IProps>(), {
  item: () => new NotificationModel(),
});

const emit = defineEmits<{
  (e: "remove", id: symbol): void;
}>();

const getClass = (type: NotificationTypesEnum) => {
  switch (type) {
    case NotificationTypesEnum.Message:
      return "message";
    case NotificationTypesEnum.Warning:
      return "warning";
  }
};

const removeNotification = () => {
  emit("remove", props.item.id);
};

onMounted(() => {
  setTimeout(() => {
    removeNotification();
  }, props.item.options.duration || 5000);
});
</script>

<style lang="scss" scoped>
.notification {
  box-shadow: 0 0 10px rgb(0, 0, 0, 0.25);
  max-width: 250px;
  width: 100%;
  background-color: white;
  padding: 10px 20px;
  border-radius: 5px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  pointer-events: auto !important;
}

.message {
  color: black;
}

.warning {
  color: red;
}

.close {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16px;
  cursor: pointer;
}
</style>
