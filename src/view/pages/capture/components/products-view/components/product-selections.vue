<template>
  <div class="d-flex align-center">
    <div class="rounded-circle bg-grey-lighten-1 px-2 py-2 mr-4 d-none d-md-flex">
      <v-icon color="grey-darken-4" size="40">mdi-upload</v-icon>
      <v-badge color="black"
               :content="filteredProductsInStore.length"
               v-if="filteredProductsInStore.length"
      ></v-badge>
    </div>
    <v-menu
        v-if="!scanProductStore.confirmedProduct && filteredProductsInStore?.length"
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
        <v-list v-if="filteredProductsInStore?.length"
        >
          <v-list-item v-for="product in filteredProductsInStore"
                       @click="selectProduct(product)"
          >
            <div class="d-flex align-center">
              <div>
                <v-img aspect-ratio="1" width="80" :src="product.styleGuide.url" class="bg-grey-darken-3"></v-img>
              </div>
              <div class="pl-5">
                <v-list-item-title>{{ product.product.code }}</v-list-item-title>
                <v-list-item-subtitle>{{ product.styleGuide.name }}</v-list-item-subtitle>
                <v-list-item-subtitle>{{ product.productionType.name }}</v-list-item-subtitle>
              </div>
              <v-spacer></v-spacer>
              <v-icon size="18"
                      class="align-self-start pointer"
                      @click.stop="deleteProduct(product.product.uuid)"
              >mdi-trash-can
              </v-icon>
            </div>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
    <span class="text-h5" v-if="!scanProductStore.confirmedProduct && !filteredProductsInStore?.length">SELECTION</span>
    <span class="text-h5" v-if="scanProductStore.confirmedProduct">PRE-SELECTION</span>
    <v-spacer></v-spacer>
    <v-btn class="ml-3"
           prepend-icon="mdi-content-save-outline"
           @click="scanProductStore.saveProduct()"
           v-if="scanProductStore.confirmedProduct"
    >
      Save
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";
import {ISavedProduct, useScanProductStore} from "../../../../../../store/ScanProductStore";
import {useStudioStore} from "../../../../../../store/StudioStore";

const scanProductStore = useScanProductStore()
const studioStore = useStudioStore()
const isOpenMenu = ref(false)

const filteredProductsInStore = computed(() =>
    scanProductStore.productsIsStore.filter(({productionType: {uuid}}) => studioStore.selectedProductionTypeUuid === uuid)
)

const selectProduct = async ({product, styleGuide, sampleCode}: ISavedProduct) => {
  await scanProductStore.getProductFromSavedList({
    productUuid: product.uuid,
    styleGuideUuid: styleGuide.uuid,
    sampleCode
  })
}

const deleteProduct = (uuid: string) => {
  const index = scanProductStore.productsIsStore.findIndex(({product}) => product.uuid === uuid)
  scanProductStore.productsIsStore.splice(index, 1)
  scanProductStore.saveInStorage()
}
</script>

<style lang="scss" scoped>

</style>