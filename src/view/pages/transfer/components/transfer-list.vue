<template>
  <div>
    <v-card flat
            v-for="transfer in transferStore.transferList.historyList"
    >
      <v-card-title>
        {{ transfer.date }}
      </v-card-title>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import {useTransferStore} from "../../../../store/TransferStore";

const transferStore = useTransferStore()
</script>

<style lang="scss" scoped>

</style>