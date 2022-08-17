<template>
  <v-card-title class="border-b">SELECT SAMPLE</v-card-title>
  <v-card-subtitle class="py-4">
    The product {{ scanProductStore.samples[0]?.product_code }} has multiple samples.
    Please select below.
  </v-card-subtitle>
  <v-card-item>
    <v-item-group v-model="selectedSampleId" selected-class="border border-primary border-opacity-100">
      <v-item v-for="(sample, i) in scanProductStore.samples"
              :key="sample.sample_uuid"
              v-slot="{ isSelected, selectedClass }"
      >
        <v-card :class="['d-flex align-center', selectedClass]"
                @click="selectSample(i)"
                class="px-4"
        >
          <div class="py-4">
            <div class="text-h5">{{ sample.sample_code }}</div>
            <div class="description">Product Code: {{ sample.product_code }}</div>
            <div class="description">Size: {{ sample.size }}</div>
          </div>
        </v-card>
      </v-item>
    </v-item-group>
  </v-card-item>
  <v-card-actions class="justify-end mt-5">
    <button-white @click="sendEvent('back')"
                  prepend-icon="mdi-arrow-left"
    >back
    </button-white>
    <v-spacer></v-spacer>
    <button-white @click="sendEvent('cancel')">cancel</button-white>
    <button-blue @click="sendEvent('select')">Continue</button-blue>
  </v-card-actions>
</template>

<script lang="ts" setup>
import ButtonWhite from "../../../../../../components/buttons/button-white.vue";
import {onActivated, onDeactivated, onMounted, onUnmounted, ref} from "vue";
import ButtonBlue from "../../../../../../components/buttons/button-blue.vue";
import {useScanProductStore} from "../../../../../../../store/ScanProductStore";

const emit = defineEmits(["cancel", "select", "back"])

const scanProductStore = useScanProductStore()
const selectedSampleId = ref(0)

const keyDownHandler = (e: KeyboardEvent) => {
  if (e.key === "ArrowDown" && selectedSampleId.value < scanProductStore.samples.length - 1)
    selectedSampleId.value += 1
  if (e.key === "ArrowUp" && selectedSampleId.value > 0)
    selectedSampleId.value -= 1
  if (e.key === "Enter")
    selectSample()
  if (e.key === "Backspace")
    sendEvent("back")
}

const unsubscribe = () => removeEventListener("keydown", keyDownHandler)

const sendEvent = (event: "cancel" | "select" | "back") => {
  unsubscribe()
  emit(event)
}

const selectSample = (i?: number) => {
  if (i) selectedSampleId.value = i
  scanProductStore.selectedSample = scanProductStore.samples[i || selectedSampleId.value]
  sendEvent("select")
}

onActivated(() => addEventListener("keydown", keyDownHandler))
onDeactivated(() => unsubscribe())
</script>

<style lang="scss" scoped>

</style>