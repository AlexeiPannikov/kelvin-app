<template>
  <v-card-title class="border-b">CONFIRM PRODUCT</v-card-title>
  <v-card-item class="position-relative"
               style="min-height: 100px"
  >
    <ui-preloader :is-loading="isLoading"
                  :transition="null"
                  contained
    >
      <v-row>
        <v-col>
          <div class="text-h5">{{ scanProductStore.product?.product_code }}</div>
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
          <div class="text-grey-lighten-1">{{ scanProductStore.selectedSample?.sample_code }}</div>
          <div class="text-h6 mt-4">Product Properties</div>
          <div class="properties-wrap">
            <div v-for="property in scanProductStore.productPropertiesList" class="mt-2">
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
    </ui-preloader>
  </v-card-item>
  <v-card-actions class="justify-end mt-5">
    <button-white @click="sendEvent('back')"
                  prepend-icon="mdi-arrow-left"
                  v-if="scanProductStore.samples.length > 1"
    >back
    </button-white>
    <v-spacer></v-spacer>
    <button-white @click="sendEvent('cancel')">cancel</button-white>
    <button-blue @click="sendEvent('confirm')">Confirm</button-blue>
  </v-card-actions>
</template>

<script lang="ts" setup>
import ButtonBlue from "../../../../../../components/buttons/button-blue.vue";
import ButtonWhite from "../../../../../../components/buttons/button-white.vue";
import {onActivated, onDeactivated, onMounted, onUnmounted, ref} from "vue";
import UiPreloader from "../../../../../../components/ui-preloader/ui-preloader.vue";
import {useScanProductStore} from "../../../../../../../store/ScanProductStore";
import {ProductModel} from "../../../../../../../api/models/responses/Products/ProductModel";
import {StyleGuide} from "../../../../../../../api/models/responses/StyleGuides/StyleGuide";

const emit = defineEmits(["cancel", "confirm", "back"])

const scanProductStore = useScanProductStore()
const isOpenMenu = ref(false)
const isLoading = ref(false)

const init = async () => {
  isLoading.value = true
  try {
    await scanProductStore.getSelectedProductData()
  } finally {
    isLoading.value = false
  }
}

const sendEvent = (event: "cancel" | "confirm" | "back") => {
  unsubscribe()
  emit(event)
}

const keyDownHandler = (e: KeyboardEvent) => {
  if (e.key === "Enter") sendEvent("confirm")
  if (e.key === "Backspace") sendEvent("back")
}

const unsubscribe = () => removeEventListener("keydown", keyDownHandler)

onActivated(() => {
  addEventListener("keydown", keyDownHandler)
  init()
})

onDeactivated(() => {
  scanProductStore.product = new ProductModel()
  scanProductStore.styleGuide = new StyleGuide()
  scanProductStore.productProperties = []
  unsubscribe()
})
</script>

<style lang="scss" scoped>
.properties-wrap {
  overflow-y: auto;
}
</style>