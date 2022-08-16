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
                  v-model.trim="scanProductStore.barcode"
                  placeholder="Enter barcode manually"
                  color="primary"
                  variant="plain"
                  single-line
                  hide-details
                  density="compact"
                  :autofocus="true"
                  :append-icon="scanProductStore.barcode ? 'mdi-arrow-left' : ''"
                  @click:append="search"
                  @keydown.enter="search"
    ></v-text-field>
  </div>
</template>

<script lang="ts" setup>
import UiPreloader from "../../../../../components/ui-preloader/ui-preloader.vue";
import {onMounted, onUnmounted, ref} from "vue";
import {useScanProductStore} from "../../../../../../store/ScanProductStore";

const emits = defineEmits<{
  (e: "scan", isManySamples: boolean): void
}>()

const scanProductStore = useScanProductStore()
const isManuallyMode = ref(false)
let interval: NodeJS.Timer = null;

const enterManually = () => {
  isManuallyMode.value = true
  unsubscribeOnScannerEvents()
}

const clickOutsideHandler = () => {
  if (isManuallyMode.value && !scanProductStore.barcode) {
    isManuallyMode.value = false;
    subscribeOnScannerEvents();
  }
}

const search = async () => {
  if (!scanProductStore.barcode) return
  await scanProductStore.search()
  scanProductStore.barcode = ""
  isManuallyMode.value = false
  if (scanProductStore.samples.length > 0) {
    emits("scan", true)
  }
}

const scannerEventsHandler = (e: KeyboardEvent) => {
  if (interval) clearInterval(interval);
  if (e.code === "Enter") {
    if (scanProductStore.barcode) {
      search();
    }
    scanProductStore.barcode = "";
    return;
  }
  if (e.key !== "Shift") {
    scanProductStore.barcode += e.key;
    interval = setInterval(() => (scanProductStore.barcode = ""), 20);
  }
};

const subscribeOnScannerEvents = () => {
  if (interval) {
    clearInterval(interval);
  }
  document.addEventListener("keydown", scannerEventsHandler);
};

const unsubscribeOnScannerEvents = () => {
  document.removeEventListener("keydown", scannerEventsHandler);
};

onMounted(() => {
  subscribeOnScannerEvents();
});

onUnmounted(() => {
  unsubscribeOnScannerEvents();
});
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