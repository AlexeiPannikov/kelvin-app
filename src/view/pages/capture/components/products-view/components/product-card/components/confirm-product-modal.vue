<template>
  <v-dialog>
    <v-card min-width="600">
      <v-card-title class="border-b">CONFIRM PRODUCT</v-card-title>
      <v-card-item class="position-relative"
                   style="min-height: 100px"
      >
        <v-row>
          <v-col>
            <div class="text-h5">{{ scanProductStore.confirmedProduct?.product_code }}</div>
            <div class="d-flex mt-4">
              <v-menu v-model="isOpenMenu">
                <template v-slot:activator="{ props }">
                  <button-white
                      v-bind="props"
                      size="small"
                      :append-icon="isOpenMenu ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                  >
                    SELECTIONS
                  </button-white>
                </template>
                <v-list density="compact">
                  <v-list-item>
                    Log Exception
                  </v-list-item>
                </v-list>
              </v-menu>
              <button-white size="small"
                            class="ml-3"
              >Edit
              </button-white>
            </div>
            <div class="text-h6 mt-4">Sample Code</div>
            <div class="text-grey-lighten-1">{{ scanProductStore.confirmedProduct?.sample_code }}</div>
            <div class="text-h6 mt-4">Product Properties</div>
            <div class="properties-wrap">
              <div v-for="property in scanProductStore.confirmedProductPropertiesList" class="mt-2">
                <div class="text-grey-lighten-1 text-uppercase description">{{ property.name }}</div>
                <div class="description">{{ property.value }}</div>
              </div>
            </div>
          </v-col>
          <v-col>
            <v-card :flat="true" class="d-flex flex-column align-center">
              <v-img
                  class="bg-grey-darken-1"
                  width="100%"
                  aspect-ratio="1"
                  :src="scanProductStore.styleGuide?.coverFile?.url">
              </v-img>
              <v-card-item class="bg-grey-darken-3">
                <div class="text-h5">{{ scanProductStore.product?.product_code }}</div>
                <div>{{ scanProductStore.product?.product_name }}</div>
              </v-card-item>
            </v-card>
          </v-col>
        </v-row>
      </v-card-item>
      <v-card-actions class="justify-end mt-5">
        <v-spacer></v-spacer>
        <button-white @click="emit('cancel')">cancel</button-white>
        <button-blue @click="emit('confirm')">Confirm</button-blue>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>

import {ref} from "vue";
import {useScanProductStore} from "../../../../../../../../store/ScanProductStore";
import ButtonWhite from "../../../../../../../components/buttons/button-white.vue";
import ButtonBlue from "../../../../../../../components/buttons/button-blue.vue";

const isOpenMenu = ref(false)

const emit = defineEmits(["cancel", "confirm"])

const scanProductStore = useScanProductStore()
</script>

<style lang="scss" scoped>
.properties-wrap {
  overflow-y: auto;
}
</style>