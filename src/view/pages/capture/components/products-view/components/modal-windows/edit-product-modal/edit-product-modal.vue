<template>
  <v-dialog scrollable>
    <v-card min-width="900">
      <v-card-title class="d-flex align-center">
        EDIT PRODUCT
        <v-spacer></v-spacer>
        <div>
          <v-switch density="compact"
                    hide-details
                    :label="scanProductStore.confirmedProduct.product.state ? 'active' : 'inactive'"
                    color="primary"
                    :false-value="0"
                    :true-value="1"
                    v-model="scanProductStore.confirmedProduct.product.state"
          ></v-switch>
        </div>
      </v-card-title>
      <v-card-text style="height: 600px">
        <v-row>
          <v-col cols="4" class="border-e">
            <v-list density="compact" class="pl-2">
              <v-list-item @click="setTab('Settings')"
                           :active="selectedTab === 'Settings'"
                           rounded
              >
                Settings
              </v-list-item>
              <v-list-item @click="setTab('Production')"
                           :active="selectedTab === 'Production'"
                           rounded
              >
                Production
              </v-list-item>
              <v-list-item @click="setTab('Properties')"
                           :active="selectedTab === 'Properties'"
                           rounded
              >
                Properties
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="8" class="">
            <v-row dense>
              <v-col cols="12" class="text-h5">{{ selectedTab }}</v-col>
              <v-col cols="12">
                <keep-alive>
                  <settings-tab v-if="selectedTab === 'Settings'"
                  ></settings-tab>
                </keep-alive>
              </v-col>
              <keep-alive>
                  <properties-tab v-if="selectedTab === 'Properties'"
                  ></properties-tab>
                </keep-alive>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="mt-3">
        <div></div>
        <v-spacer></v-spacer>
        <button-white @click="cancel"
        >
          Cancel
        </button-white>
        <button-blue @click="save"
                     :is-loading="scanProductStore.isLoadingEditProduct"
                     :disabled="!scanProductStore.isChangedConfirmedProduct"
        >
          Save
        </button-blue>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import ButtonWhite from "../../../../../../../components/buttons/button-white.vue";
import ButtonBlue from "../../../../../../../components/buttons/button-blue.vue";
import {computed, defineProps, onMounted, ref} from "vue";
import SettingsTab from "./settings-tab.vue";
import {useScanProductStore} from "../../../../../../../../store/ScanProductStore";
import PropertiesTab from "./properties-tab.vue";

interface IProps {
  storeName: "scan" | "product"
}

const props = withDefaults(defineProps<IProps>(), {
  storeName: "scan"
})

const emit = defineEmits(['cancel'])

type TabName = "Settings" | "Production" | "Properties"
const selectedTab = ref<TabName>("Settings")
const scanProductStore = useScanProductStore()

const store = computed(() => {
  if (props.storeName === "scan")
    return scanProductStore
})

const setTab = (tabName: TabName) => {
  selectedTab.value = tabName
}

const save = async () => {
  await scanProductStore.editConfirmedProduct()
  emit("cancel")
}

const cancel = () => {
  scanProductStore.resetConfirmedProduct()
  emit('cancel')
}
</script>

<style lang="scss" scoped>

</style>