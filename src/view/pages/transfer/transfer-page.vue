<template>
  <v-row class="fill-height overflow-hidden mb-0" no-gutters>
    <transition name="fade" appear>
      <v-col cols="3"
             class="overflow-hidden position-relative fill-height border-e flex-grow-0 pb-10"
      >
        <transfer-list></transfer-list>
        <bottom-panel without-buttons
        >
        </bottom-panel>
      </v-col>
    </transition>
    <v-col cols="6"
           class="border-e fill-height overflow-hidden position-relative px-4 pt-4 pb-10"
    >
      <transfer-files-view></transfer-files-view>
      <bottom-panel without-buttons
      >
      </bottom-panel>
    </v-col>
    <v-col cols="3"
           class="pb-0 fill-height overflow-hidden position-relative"
    >
      <transfer-file-view></transfer-file-view>
      <bottom-panel without-buttons
      >
      </bottom-panel>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import {useTransferStore} from "../../../store/TransferStore";
import {onMounted} from "vue";
import BottomPanel from "../../layouts/components/bottom-panel.vue";
import TransferList from "./components/transfer-list.vue";
import TransferFilesView from "./components/transfer-files-view.vue";
import TransferFileView from "./components/transfer-file-view.vue";

const transferStore = useTransferStore()

onMounted(() => {
  transferStore.getTransferHistory()
  transferStore.isFirstLoading = false
})
</script>

<style lang="scss" scoped>

</style>