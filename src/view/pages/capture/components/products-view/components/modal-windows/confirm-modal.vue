<template>
  <v-dialog>
    <v-card min-width="600">
      <keep-alive>
        <select-task v-if="currentStep === ConfirmStepEnum.SelectTask"
                     @cancel="emit('cancel')"
                     @select="next"
        ></select-task>
      </keep-alive>
      <keep-alive>
        <select-sample v-if="currentStep === ConfirmStepEnum.SelectSample"
                       @cancel="emit('cancel')"
                       @select="next"
                       @back="prev"
        >

        </select-sample>
      </keep-alive>
      <confirm-product v-if="currentStep === ConfirmStepEnum.ConfirmProduct"
                       @cancel="emit('cancel')"
                       @back="prev"
      >
      </confirm-product>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import {useSampleStore} from "../../../../../../../store/SamplesStore";
import {defineAsyncComponent, reactive, ref, useAttrs, watch} from "vue";
import {ConfirmStepEnum} from "./ConfirmStepEnum";
import ConfirmProduct from "./confirm-product.vue";

const SelectSample = defineAsyncComponent(() => import("./select-sample.vue"));
const SelectTask = defineAsyncComponent(() => import("./select-task.vue"))

const emit = defineEmits(["cancel"])

const samplesStore = useSampleStore()
const attrs = useAttrs()

const currentStep = ref<ConfirmStepEnum>(null)
const stepList = reactive<ConfirmStepEnum[]>([])

const initStep = () => {
  const length = samplesStore.samples.length
  switch (true) {
    case length > 1:
      stepList.push(ConfirmStepEnum.SelectTask)
      stepList.push(ConfirmStepEnum.SelectSample)
      stepList.push(ConfirmStepEnum.ConfirmProduct)
      break;
    case length === 1:
      stepList.push(ConfirmStepEnum.ConfirmProduct)
      break;
  }
  currentStep.value = stepList[0]
}

const next = () =>
    currentStep.value = stepList[currentStep.value] + 1

const prev = () => {
  if (currentStep.value > 0)
    currentStep.value -= 1
}
const resetState = () => {
  stepList.splice(0)
  currentStep.value = null
}

watch(() => attrs.modelValue, () => {
  if (attrs.modelValue) initStep()
  else resetState()
})
</script>

<style lang="scss" scoped>

</style>