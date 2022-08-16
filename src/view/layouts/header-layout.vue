<template>
  <v-app-bar flat color="main-content-back border-b">
    <v-row justify="space-between">
      <v-col>
        <h1 class="font-weight-medium">{{ title }}</h1>
      </v-col>
      <v-col cols="auto" v-if="route.name === 'capture'">
        <ui-select :items="studioStore.enabledProductionTypesSelectList"
                   v-model="studioStore.selectedProductionTypeUuid"
                   :loading="studioStore.isLoadingProductionTypes"
        >
        </ui-select>
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script lang="ts" setup>
import {useRoute} from "vue-router";
import {computed, watch} from "vue";
import {useStudioStore} from "../../store/StudioStore";
import UiSelect from "../components/ui-select/ui-select.vue";

const route = useRoute()
const studioStore = useStudioStore()

const title = computed(() => {
  return (route.meta.title as string).toLocaleUpperCase()
})

watch(() => studioStore.enabledProductionTypesSelectList,
    () => studioStore.selectedProductionTypeUuid = studioStore.enabledProductionTypesSelectList[0].value
)
</script>

<style lang="scss" scoped>

</style>
