<template>
  <v-card-title class="border-b">NO PRODUCTION TASKS</v-card-title>
  <v-card-subtitle class="py-4">
    There are no {{ studioStore.productionTypeName }} tasks to produce.
    Please select a different production type to continue.
  </v-card-subtitle>
  <div>
  </div>
  <v-card-item>
    <div class="text-uppercase text-grey">OTHER TASKS FOR {{ scanProductStore.product?.product?.product_code }}</div>
    <v-item-group v-model="selectedProdTypeIdx">
      <v-item v-for="(shootingType, i) in scanProductStore.product?.styleGuide?.shootingTypes"
              :key="shootingType.production_type_uuid"
              v-slot="{ isSelected }"
      >
        <div class="d-flex justify-start align-center border-b py-2 pointer"
             @click="changeProdType(i)"
        >
          <v-radio :model-value="isSelected" readonly color="primary" density="compact"
                   class="flex-grow-0"></v-radio>
          <div class="flex-grow-1 pl-4">
            {{ studioStore.productionTypes.find(item => item.uuid === shootingType.production_type_uuid)?.name }}
          </div>
        </div>
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
import ButtonWhite from "../../../../../../../components/buttons/button-white.vue";
import {onActivated, onDeactivated, ref} from "vue";
import ButtonBlue from "../../../../../../../components/buttons/button-blue.vue";
import {useScanProductStore} from "../../../../../../../../store/ScanProductStore";
import {useStudioStore} from "../../../../../../../../store/StudioStore";

const emit = defineEmits(["cancel", "select", "back"])

const scanProductStore = useScanProductStore()
const studioStore = useStudioStore()
const selectedProdTypeIdx = ref(0)

const keyDownHandler = (e: KeyboardEvent) => {
  if (e.key === "ArrowDown" && selectedProdTypeIdx.value < scanProductStore.samples.length - 1)
    selectedProdTypeIdx.value += 1
  if (e.key === "ArrowUp" && selectedProdTypeIdx.value > 0)
    selectedProdTypeIdx.value -= 1
  if (e.key === "Enter")
    changeProdType()
  if (e.key === "Backspace")
    sendEvent("back")
}

const unsubscribe = () => removeEventListener("keydown", keyDownHandler)

const sendEvent = (event: "cancel" | "select" | "back") => {
  unsubscribe()
  emit(event)
}

const changeProdType = (i?: number) => {
  if (i) selectedProdTypeIdx.value = i
  studioStore.setAndSaveProductionType(scanProductStore.product.styleGuide.shootingTypes[selectedProdTypeIdx.value].production_type_uuid)
  sendEvent("select")
}
onActivated(() => console.log(scanProductStore.product.styleGuide.shootingTypes))
onActivated(() => addEventListener("keydown", keyDownHandler))
onDeactivated(() => unsubscribe())
</script>

<style lang="scss" scoped>

</style>