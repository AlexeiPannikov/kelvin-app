<template>
  <v-col v-for="property in scanProductStore.confirmedProduct.customProperties"
         :key="property.id"
         class="mt-4"
         cols="6"
  >
    <div>{{ property.name }}</div>
    <template v-if="property.type === 'text'">
      <v-text-field
          density="compact"
          variant="outlined"
          v-model="property.value"
          hide-details
          class="mt-1"
          :disabled="!scanProductStore.confirmedProduct.product.state"
      >
      </v-text-field>
    </template>
    <v-select v-if="property.type === 'list'"
              density="compact"
              variant="outlined"
              class="mt-1"
              v-model="property.value"
              :items="property.optionsSelectList"
              :disabled="!scanProductStore.confirmedProduct.product.state"
    >
    </v-select>
    <ui-datepicker v-if="property.type === 'date'"
                   v-model="property.value"
                   :disabled="!scanProductStore.confirmedProduct.product.state"
    >
    </ui-datepicker>
  </v-col>
</template>

<script lang="ts" setup>

import {useScanProductStore} from "../../../../../../../../store/ScanProductStore";
import {ref} from "vue";
import UiDatepicker from "../../../../../../../components/ui-datepicker/ui-datepicker.vue";

const scanProductStore = useScanProductStore()
const datepicker = ref(null)
</script>

<style lang="scss" scoped>

</style>