<template>
  <div>
    <ui-select :items="statusList"
               v-model="scanProductStore.product.product.status"
               :disabled="isDisabled"
               variant="plain"
               class="w-25 rounded px-2"
               :class="selectStatusClassList"
    ></ui-select>
  </div>
  <div v-for="property in scanProductStore.product.defaultProperties"
       :key="property.id"
       class="mt-4"
  >
    <div>{{ property.name }}</div>
    <v-text-field
        v-if="property.type === 'text'"
        density="compact"
        variant="outlined"
        v-model="property.value"
        hide-details
        class="mt-1"
        :disabled="isDisabled"
    >
    </v-text-field>
    <v-select v-if="property.type === 'list'"
              density="compact"
              variant="outlined"
              class="mt-1"
              v-model="property.value"
              :items="property.optionsSelectList"
              :disabled="isDisabled"
    >
    </v-select>
    <ui-datepicker v-if="property.type === 'date'"
                   v-model="property.value"
                   :disabled="isDisabled"
    >
    </ui-datepicker>
  </div>
  <div class="mt-4 d-flex justify-space-between">
    <ui-select class="mr-9"
               :disabled="!isOverride"
               variant="outlined"
               :items="styleGuidesStore.styleGuidesSelectList"
               v-model="scanProductStore.product.product.styleguide_uuid"
    ></ui-select>
    <div>
      <v-switch density="compact"
                hide-details
                :label="isOverride ? 'ON' : 'OFF'"
                color="primary"
                v-model="isOverride"
      ></v-switch>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useScanProductStore} from "../../../../../../../../store/ScanProductStore";
import UiDatepicker from "../../../../../../../components/ui-datepicker/ui-datepicker.vue";
import {computed, onActivated, reactive, ref} from "vue";
import {ProductStatusEnum} from "../../../../../../../../api/models/requests/Products/ProductStatusEnum";
import UiSelect from "../../../../../../../components/ui-select/ui-select.vue";
import {useStyleGuidesStore} from "../../../../../../../../store/StyleGuidesStore";

const scanProductStore = useScanProductStore()
const styleGuidesStore = useStyleGuidesStore()
const isOverride = ref(false)

styleGuidesStore.getStyleGuides(scanProductStore.product.product.client_id)

const statusList = reactive([
  {title: "BACKLOG", value: ProductStatusEnum.Backlog},
  {title: "TODO", value: ProductStatusEnum.ToDo},
])

const isDisabled = computed(() => {
  return (
      scanProductStore.product.product.status === ProductStatusEnum.Done ||
      scanProductStore.product.product.status === ProductStatusEnum.Progress ||
      !scanProductStore.product.product.state
  );
})

const initStatusList = () => {
  if (scanProductStore.product.product.status === ProductStatusEnum.Done ||
      scanProductStore.product.product.status === ProductStatusEnum.Progress) {
    statusList.push(
        {title: "IN PROGRESS", value: ProductStatusEnum.Progress},
        {title: "DONE", value: ProductStatusEnum.Done},
    )
  } else {
    const inProgressIndex = statusList.findIndex(({value}) => value === ProductStatusEnum.Progress)
    const doneIndex = statusList.findIndex(({value}) => value === ProductStatusEnum.Done)
    if (inProgressIndex >= 0)
      statusList.splice(inProgressIndex, 1)
    if (doneIndex >= 0)
      statusList.splice(doneIndex, 1)
  }
}

const selectStatusClassList = computed(() => {
  switch (scanProductStore.product.product.status) {
    case ProductStatusEnum.Backlog:
      return ["bg-grey"]
    case ProductStatusEnum.Done:
      return ["bg-green"]
    case ProductStatusEnum.Progress:
      return ["bg-primary"]
    case ProductStatusEnum.ToDo:
      return ["bg-primary"]
  }
})

onActivated(() => initStatusList())
</script>

<style lang="scss" scoped>

</style>