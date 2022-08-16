<template>
  <div class="d-flex align-center">
    <div class="rounded-circle bg-grey-lighten-1 px-2 py-2 mr-4 d-none d-md-flex">
      <v-icon color="grey-darken-4" size="40">mdi-upload</v-icon>
      <v-badge color="black" :content="productList.length">{{}}</v-badge>
    </div>
    <v-menu
        v-if="!scanProductStore.confirmedProduct"
        v-model="isOpenMenu"
    >
      <template v-slot:activator="{ props }">
        <v-btn
            v-bind="props"
            :append-icon="isOpenMenu ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        >
          SELECTIONS
        </v-btn>
      </template>

      <v-card min-width="300">

      </v-card>
    </v-menu>
    <span v-else>PRE-SELECTION</span>
    <v-spacer></v-spacer>
    <v-btn class="ml-3"
           prepend-icon="mdi-content-save-outline"
           @click="saveProduct"
           v-if="scanProductStore.confirmedProduct"
    >
      Save
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import {useScanProductStore} from "../../../../../../store/ScanProductStore";
import {useStudioStore} from "../../../../../../store/StudioStore";

interface ISavedProduct {
  product: {
    code: string,
    uuid: string
  }
  styleGuide: {
    name: string,
    uuid: string,
    url: string
  }
  productionType: {
    name: string,
    uuid: string
  }
}

const scanProductStore = useScanProductStore()
const studioStore = useStudioStore()
const isOpenMenu = ref(false)
const productList = reactive<ISavedProduct[]>(JSON.parse(localStorage.getItem("products")) || [])

const saveProduct = () => {
  const {product, styleGuide} = scanProductStore.confirmedProduct
  const {selectedProductionTypeUuid} = studioStore
  const productToSave: ISavedProduct = {
    product: {code: product.product_code, uuid: product.product_uuid},
    productionType: {
      name: studioStore.productionTypes.find(({uuid}) => selectedProductionTypeUuid === uuid)?.name,
      uuid: selectedProductionTypeUuid
    },
    styleGuide: {name: styleGuide.name, uuid: styleGuide.uuid, url: styleGuide.coverFile.url}
  }
  const saveInStorage = () => localStorage.setItem("products", JSON.stringify(productList))
  if (!productList?.length) {
    productList.push(productToSave)
  }
  if (productList?.length) {
    const index = productList.findIndex(({product: {uuid}}) => product.product_uuid === uuid)
    index ? productList.push(productToSave) : productList.splice(index, 1, productToSave)
  }
  saveInStorage()
  scanProductStore.confirmedProduct = null
}
</script>

<style lang="scss" scoped>

</style>