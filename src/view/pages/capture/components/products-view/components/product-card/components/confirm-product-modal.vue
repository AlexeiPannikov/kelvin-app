<template>
  <v-dialog>
    <v-card min-width="600">
      <v-card-title class="border-b">CONFIRM PRODUCT</v-card-title>
      <v-card-item class="position-relative"
                   style="min-height: 100px"
      >
        <v-row>
          <v-col>
            <div class="text-h5">{{ scanProductStore.confirmedProduct?.product.product_code }}</div>
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
                            @click="openEditor"
              >Edit
              </button-white>
            </div>
            <div class="text-h6 mt-4">Sample Code</div>
            <div class="text-grey-lighten-1">{{ scanProductStore.confirmedProduct?.sampleCode }}</div>
            <div class="text-h6 mt-4">Product Properties</div>
            <div class="properties-wrap">
              <div v-for="property in scanProductStore.confirmedProduct.properties" class="mt-2">
                <template v-if="property.value">
                  <div class="text-grey-lighten-1 text-uppercase description">{{ property.name }}</div>
                  <div class="description">{{ property.value }}</div>
                </template>
              </div>
            </div>
          </v-col>
          <v-col>
            <v-card :flat="true" class="d-flex flex-column align-center">
              <v-img
                  class="bg-grey-darken-1"
                  width="100%"
                  aspect-ratio="1"
                  :src="scanProductStore.confirmedProduct.styleGuide?.coverFile?.url">
              </v-img>
              <v-card-item class="bg-grey-darken-3">
                <div class="text-h5">{{ scanProductStore.confirmedProduct.product?.product_code }}</div>
                <div>{{ scanProductStore.confirmedProduct.product?.product_name }}</div>
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

    <edit-product-modal v-model="isOpenEditModal"
                        @cancel="closeEditor"
    ></edit-product-modal>
  </v-dialog>
</template>

<script lang="ts" setup>

import {getCurrentInstance, ref} from "vue";
import {useScanProductStore} from "../../../../../../../../store/ScanProductStore";
import ButtonWhite from "../../../../../../../components/buttons/button-white.vue";
import ButtonBlue from "../../../../../../../components/buttons/button-blue.vue";
import EditProductModal from "../../modal-windows/edit-product-modal/edit-product-modal.vue";

const isOpenMenu = ref(false)
const instance = getCurrentInstance();

const emit = defineEmits(["cancel", "confirm"])

const scanProductStore = useScanProductStore()
const isOpenEditModal = ref(false)

const openEditor = () => {
  scanProductStore.copyConfirmedProduct()
  isOpenEditModal.value = true
}

const closeEditor = () => {
  console.log(scanProductStore.confirmedProduct.product)
  isOpenEditModal.value = false
}
</script>

<style lang="scss" scoped>
.properties-wrap {
  overflow-y: auto;
}
</style>