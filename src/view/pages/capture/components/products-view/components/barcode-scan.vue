<template>
  <div v-click-outside="clickOutsideHandler" class="barcode-scan rounded px-8 py-3 d-flex align-center">
    <template v-if="!isManuallyMode">
      <div class="position-relative">
        <ui-preloader contained
                      size="25"
                      :is-loading="true"
                      :transition="null"
        >
        </ui-preloader>
      </div>
      <div class="ml-5 text-uppercase" style="font-size: 13px">
        <div>Scan Product</div>
        <div>or
          <span @click="enterManually" class="pointer text-decoration-underline manually">
        Enter Manually
      </span>
        </div>
      </div>
    </template>
    <v-text-field v-else
                  placeholder="Enter barcode manually"
                  color="primary"
                  variant="plain"
                  single-line
                  hide-details
                  density="compact"
                  :autofocus="true"
    ></v-text-field>
  </div>
</template>

<script lang="ts" setup>
import UiPreloader from "../../../../../components/ui-preloader/ui-preloader.vue";
import {ref} from "vue";

const isManuallyMode = ref(false)

const enterManually = () => {
  isManuallyMode.value = true
}

const clickOutsideHandler = () => {
  isManuallyMode.value = false
}
</script>

<style lang="scss" scoped>
.barcode-scan {
  border: 1px solid rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-primary));
  background-color: rgb(var(--v-theme-primary), 0.2);
}

.manually {
  transition: all 0.1s ease-in-out;

  &:hover {
    color: white;
  }
}
</style>