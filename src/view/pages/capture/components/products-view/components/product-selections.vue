<template>
  <div class="d-flex align-center">
    <div class="rounded-circle bg-grey-lighten-1 px-2 py-2 mr-4 d-none d-lg-flex">
      <v-icon color="grey-darken-4" size="40">mdi-upload</v-icon>
      <v-badge color="black"
               :content="scanProductStore.productsInStore.length"
               v-if="scanProductStore.productsInStore.length"
      ></v-badge>
    </div>
    <v-menu
        v-if="!scanProductStore.confirmedProduct && scanProductStore.productsInStore?.length"
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
        <v-list v-if="scanProductStore.productsInStore?.length"
        >
          <v-list-item v-for="product in scanProductStore.productsInStore"
                       @click="selectProduct(product.product.uuid, product.productionType.uuid)"
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
                      @click.stop="deleteProduct(product.product.uuid, product.productionType.uuid)"
              >mdi-trash-can
              </v-icon>
            </div>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
    <span class="text-h5" v-if="!scanProductStore.confirmedProduct && !scanProductStore.productsInStore?.length">SELECTION</span>
    <span class="text-h5" v-if="scanProductStore.confirmedProduct">PRE-SELECTION</span>
    <v-spacer></v-spacer>
    <v-btn class="ml-3"
           @click="scanProductStore.saveProduct()"
           v-if="scanProductStore.confirmedProduct"
    >
      <v-icon>mdi-content-save-outline</v-icon>
      <span class="ml-2">{{ isVisibleTransfer ? "" : "Save" }}</span>
    </v-btn>
    <button-blue class="ml-3"
                 v-if="isVisibleTransfer"
                 @click="transfer"
    >
      Transfer
    </button-blue>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";
import {useScanProductStore} from "../../../../../../store/ScanProductStore";
import {useStudioStore} from "../../../../../../store/StudioStore";
import ButtonBlue from "../../../../../components/buttons/button-blue.vue";
import {useTransferStore} from "../../../../../../store/TransferStore";
import {useUserSettingsStore} from "../../../../../../store/UserSettingsStore";
import {BehaviourAfterTransferEnum} from "../../../../../../store/models/BehaviourAfterTransferEnum";
import {useRouter} from "vue-router";

const scanProductStore = useScanProductStore()
const studioStore = useStudioStore()
const transfersStore = useTransferStore()
const userSettingsStore = useUserSettingsStore()
const isOpenMenu = ref(false)
const router = useRouter()

const isVisibleTransfer = computed(() => {
  const currentShootingType = scanProductStore.confirmedProduct?.styleGuide?.shootingTypes
      .find(({production_type_uuid}) => studioStore.selectedProductionTypeUuid === production_type_uuid)
  return currentShootingType?.isValidNumberOfPictures
})

const selectProduct = async (productUuid: string, prodTypeUuid: string) => {
  await scanProductStore.getProductFromSavedList(productUuid, prodTypeUuid)
}

const deleteProduct = (productUuid: string, prodTypeUuid: string) => {
  scanProductStore.deleteProduct(productUuid, prodTypeUuid)
}

const transfer = () => {
  if (userSettingsStore.primarySettings.behaviourAfterTransfer === BehaviourAfterTransferEnum.Go)
    router.push({name: "transfer"})
  transfersStore.transfer()
}
</script>

<style lang="scss" scoped>

</style>