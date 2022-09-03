<template>
  <div class="fill-height w-100">
    <v-img aspect-ratio="1" :src="selectedFile?.path">

    </v-img>
  </div>
</template>

<script lang="ts" setup>
import {useTransferStore} from "../../../../store/TransferStore";
import {computed} from "vue";

const transferStore = useTransferStore()

const selectedFile = computed(() => transferStore.selectedTransfer?.allImages.find(({isSelected}) => isSelected))
</script>

<style lang="scss" scoped>

</style>