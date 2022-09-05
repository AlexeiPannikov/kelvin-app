<template>
  <div class="overflow-y-auto fill-height">
    <v-list :title="group[0]"
            v-for="(group, i) in transferStore.transferList.sortedHistoryByDate"
            :key="i"
            class="py-0"
            bg-color="transparent"
    >
      <div class="text-h6 d-flex align-center justify-space-between px-4 py-2 font-weight-medium">
        {{ group[0] }}
        <span style="font-size: 16px">{{ group[1].length }}</span>
      </div>
      <transfer-item v-for="transfer in group[1]"
                     :key="transfer.uuid"
                     :transfer="transfer"
                     @click="selectTransfer(transfer)"
      ></transfer-item>
    </v-list>
  </div>
</template>

<script lang="ts" setup>
import {useTransferStore} from "../../../../store/TransferStore";
import TransferItem from "./transfer-item.vue";
import {Transfer} from "../../../../store/models/Transfer";

const transferStore = useTransferStore()

const selectTransfer = (transfer: Transfer) => {
  transferStore.selectedTransfer = transfer
  transferStore.selectedTransfer.allImages[0].isSelected = true
}
</script>

<style lang="scss" scoped>

</style>