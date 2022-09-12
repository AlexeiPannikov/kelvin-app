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
      <keep-alive>
        <select-production-type v-if="currentStep === ConfirmStepEnum.SelectProductionType"
                                :is-visible-back="!!stepList.indexOf(currentStep)"
                                @cancel="emit('cancel')"
                                @select="next"
                                @back="prev"
        ></select-production-type>
      </keep-alive>
      <keep-alive>
        <product-confirm v-if="currentStep === ConfirmStepEnum.ConfirmProduct"
                         :is-visible-back="!viewMode && stepList.length > 1"
                         @cancel="emit('cancel')"
                         @confirm="confirmProduct"
                         @back="prev"
        ></product-confirm>
      </keep-alive>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import {defineAsyncComponent, defineProps, reactive, ref, useAttrs, watch} from "vue";
import {ConfirmStepEnum} from "./ConfirmStepEnum";
import {useScanProductStore} from "../../../../../../../../store/ScanProductStore";
import ProductConfirm from "./product-confirm.vue";
import SelectProductionType from "./select-production-type.vue";

const SelectSample = defineAsyncComponent(() => import("./select-sample.vue"));
const SelectTask = defineAsyncComponent(() => import("./select-task.vue"))

const props = defineProps({
  viewMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(["cancel"])

const attrs = useAttrs()
const scanProductStore = useScanProductStore()
const currentStep = ref<ConfirmStepEnum>(null)
const stepList = reactive<ConfirmStepEnum[]>([])

const initStep = () => {
  const length = scanProductStore.samples.length
  switch (true) {
    case length > 1 && !props.viewMode:
      stepList.push(ConfirmStepEnum.SelectTask)
      stepList.push(ConfirmStepEnum.SelectSample)
      stepList.push(ConfirmStepEnum.ConfirmProduct)
      break;
    case length === 1 || props.viewMode:
      if (!scanProductStore.isHasSelectedProdType || !scanProductStore.isHasAvailableTasks) {
        stepList.push(ConfirmStepEnum.SelectProductionType)
      }
      stepList.push(ConfirmStepEnum.ConfirmProduct)
      break;
  }
  currentStep.value = stepList[0]
}

const next = () => {
  if (currentStep.value === ConfirmStepEnum.SelectSample && !scanProductStore.isHasSelectedProdType) {
    stepList.splice(2, 0, ConfirmStepEnum.SelectProductionType)
  }
  if (stepList.indexOf(currentStep.value) >= stepList.length - 1) return;
  currentStep.value = stepList[stepList.indexOf(currentStep.value)] + 1
}

const prev = () => {
  if (stepList.indexOf(currentStep.value) > 0)
    currentStep.value = stepList[stepList.indexOf(currentStep.value)] - 1
  else emit("cancel")
}

const resetState = () => {
  stepList.splice(0)
  currentStep.value = null
  scanProductStore.resetData()
}

watch(() => attrs.modelValue, () => {
  if (attrs.modelValue) initStep()
  else resetState()
})

const confirmProduct = async () => {
  const res = await scanProductStore.confirmProduct()
  if (res)
    emit("cancel")
}
</script>

<style lang="scss" scoped>

</style>