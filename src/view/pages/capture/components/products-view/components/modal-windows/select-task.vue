<template>
  <v-card-title class="border-b">SELECT TASK</v-card-title>
  <v-card-subtitle class="py-4">The search returned multiple tasks in the database.
    Please select below
  </v-card-subtitle>
  <v-card-item>
    <v-item-group v-model="selectedTask" selected-class="border border-primary border-opacity-100">
      <v-item v-for="(sample, i) in samplesStore.samples"
              :key="sample.sample_uuid"
              v-slot="{ isSelected, selectedClass }"
      >
        <v-card :class="['d-flex align-center', selectedClass]"
                @click="selectTask(i)"
                class="px-4 py-4"
        >
          <div>
            <div class="text-h5">{{ sample.job_name }}</div>
            <div class="description">Product Code: {{ sample.product_code }}</div>
          </div>
        </v-card>
      </v-item>
    </v-item-group>
  </v-card-item>
  <v-card-actions class="justify-end mt-5">
    <button-white @click="emit('cancel')">cancel</button-white>
  </v-card-actions>
</template>

<script lang="ts" setup>
import ButtonWhite from "../../../../../../components/buttons/button-white.vue";
import {useSampleStore} from "../../../../../../../store/SamplesStore";
import {onMounted, onUnmounted, ref} from "vue";
import {selectedTaskCode} from "./SelectedTaskCode"

const emit = defineEmits(["cancel", "select"])

const samplesStore = useSampleStore()
const selectedTask = ref(0)

const keyDownHandler = (e: KeyboardEvent) => {
  if (e.key === "ArrowDown" && selectedTask.value < samplesStore.samples.length - 1) {
    selectedTask.value += 1
  }
  if (e.key === "ArrowUp" && selectedTask.value > 0) {
    selectedTask.value -= 1
  }
  if (e.key === "Enter") {
    selectTask()
  }
}

const selectTask = (i?: number) => {
  if (i) selectedTask.value = i
  selectedTaskCode.value = samplesStore.samples[i].job_code
  emit("select")
}

onMounted(() => addEventListener("keydown", keyDownHandler))
onUnmounted(() => removeEventListener("keydown", keyDownHandler))
</script>

<style lang="scss" scoped>

</style>