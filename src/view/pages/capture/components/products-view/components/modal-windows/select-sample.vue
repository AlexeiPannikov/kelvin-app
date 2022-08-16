<template>
  <v-card-title class="border-b">SELECT SAMPLE</v-card-title>
  <v-card-subtitle class="py-4">
    The product {{ samplesStore.samples[0].product_code }} has multiple samples.
    Please select below.
  </v-card-subtitle>
  <v-card-item>
    <v-item-group v-model="selectedSample" selected-class="border border-primary border-opacity-100">
      <v-item v-for="(sample, i) in samplesStore.samples"
              :key="sample.sample_uuid"
              v-slot="{ isSelected, selectedClass }"
      >
        <v-card :class="['d-flex align-center', selectedClass]"
                @click="selectTask(i)"
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
    <button-white @click="emit('back')"
                  prepend-icon="mdi-arrow-left"
    >back
    </button-white>
    <v-spacer></v-spacer>
    <button-white @click="emit('cancel')">cancel</button-white>
    <button-blue @click="emit('select')">Continue</button-blue>
  </v-card-actions>
</template>

<script lang="ts" setup>
import ButtonWhite from "../../../../../../components/buttons/button-white.vue";
import {useSampleStore} from "../../../../../../../store/SamplesStore";
import {onMounted, onUnmounted, ref} from "vue";
import ButtonBlue from "../../../../../../components/buttons/button-blue.vue";

const emit = defineEmits(["cancel", "select", "back"])

const samplesStore = useSampleStore()

const selectedSample = ref(0)

const keyDownHandler = (e: KeyboardEvent) => {
  if (e.key === "ArrowDown" && selectedSample.value < samplesStore.samples.length - 1) {
    selectedSample.value += 1
  }
  if (e.key === "ArrowUp" && selectedSample.value > 0) {
    selectedSample.value -= 1
  }
  if (e.key === "Enter") {
    selectTask()
  }
}

const selectTask = (i?: number) => {
  if (i) selectedSample.value = i
  samplesStore.sample = samplesStore.samples[i]
  emit("select")
}

onMounted(() => addEventListener("keydown", keyDownHandler))
onUnmounted(() => removeEventListener("keydown", keyDownHandler))
</script>

<style lang="scss" scoped>

</style>