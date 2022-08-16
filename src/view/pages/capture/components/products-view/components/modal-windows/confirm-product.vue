<template>
  <v-card-title class="border-b">CONFIRM PRODUCT</v-card-title>
  <v-card-item>
    <v-row>
      <v-col>
        <div class="text-h5">{{ productsStore.product?.product_code }}</div>
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
        <div class="text-grey-lighten-1">{{ samplesStore.sample.sample_code }}</div>
      </v-col>
      <v-col>
        <v-card flat class="d-flex flex-column align-center">
          <v-img
              class="bg-grey-darken-1"
              width="100%"
              aspect-ratio="1"
              :src="styleGuidesStore.styleGuide.coverFile?.url">
          </v-img>
          <v-card-item class="bg-grey-darken-3">
            <div class="text-h5">{{ productsStore.product?.product_code }}</div>
            <div>{{ productsStore.product?.product_name }}</div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-card-item>
  <v-card-actions class="justify-end mt-5">
    <button-white @click="emit('back')"
                  prepend-icon="mdi-arrow-left"
    >back
    </button-white>
    <v-spacer></v-spacer>
    <button-white @click="emit('cancel')">cancel</button-white>
    <button-blue @click="emit('select')">Confirm</button-blue>
  </v-card-actions>
</template>

<script lang="ts" setup>
import ButtonBlue from "../../../../../../components/buttons/button-blue.vue";
import ButtonWhite from "../../../../../../components/buttons/button-white.vue";
import {computed, onMounted, ref} from "vue";
import {useSampleStore} from "../../../../../../../store/SamplesStore";
import {useProductsStore} from "../../../../../../../store/ProductsStore";
import {useStyleGuidesStore} from "../../../../../../../store/StyleGuidesStore";
import {selectedTaskCode} from "./SelectedTaskCode"

const emit = defineEmits(["cancel", "select", "back"])

const samplesStore = useSampleStore()
const productsStore = useProductsStore()
const styleGuidesStore = useStyleGuidesStore()
const isOpenMenu = ref(false)

const foundedProduct = computed(() => productsStore.products.find(({job_code}) => selectedTaskCode.value === job_code))

const init = async () => {
  await productsStore.getProducts(samplesStore.samples[0].product_code)
  await productsStore.getProduct(foundedProduct.value.product_uuid)
  await styleGuidesStore.viewStyleGuide(productsStore.product.styleguide_uuid)
}
init()
</script>

<style lang="scss" scoped>

</style>