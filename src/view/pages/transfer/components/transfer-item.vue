<template>
  <v-list-item class="border-t"
               :disabled="transferStore.isLoading"
               @click="emit('click')"
  >
    <div class="d-flex">
      <div>
        <v-img :src="transfer.files[0].path"
               width="50"
               aspect-ratio="1"
               class="bg-white"
        ></v-img>
      </div>
      <div class="px-3 overflow-hidden">
        <div class="text-no-wrap overflow-hidden" style="text-overflow: ellipsis">{{ transfer.productCode }} -
          {{ transfer.productionTypeName }}
        </div>
        <div style="font-size: 13px; opacity: 0.5">{{ transfer.files.length }}
          {{ transfer.files.length > 1 ? 'FILES' : 'FILE' }}
        </div>
      </div>
      <v-spacer></v-spacer>
      <div class="d-flex align-center">
        <v-tooltip location="start">
          <template #activator="{props}">
            <v-progress-circular :indeterminate="transfer.uploading"
                                 :bg-color="!transfer.uploading && !transfer.uploadSuccessfully ? 'orange' : ''"
                                 v-bind="props"
                                 width="2"
                                 size="27"
            >
              <v-icon v-if="transfer.uploading" size="16">mdi-arrow-top</v-icon>
              <v-icon v-if="!transfer.uploading && transfer.uploadSuccessfully" size="16">mdi-check</v-icon>
              <div v-if="!transfer.uploading && !transfer.uploadSuccessfully" class="mt-1 text-orange">
                !
              </div>
            </v-progress-circular>
          </template>
          <span v-if="transfer.uploading">UPLOADING</span>
          <span v-if="!transfer.uploading && transfer.uploadSuccessfully">UPLOADED SUCCESSFULLY</span>
          <span v-if="!transfer.uploading && !transfer.uploadSuccessfully">ERROR</span>
        </v-tooltip>
      </div>
      <div class="d-flex align-center ml-3">
        <v-menu location="bottom"
        >
          <template #activator="{props}">
            <v-icon @click="emit('click')" v-bind="props">mdi-dots-horizontal</v-icon>
          </template>
          <v-list density="compact"

          >
            <v-list-item @click="isOpenDeleteWarning = true"
            >
              Delete Transfer
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <delete-warning-modal v-model="isOpenDeleteWarning"
                          @ok="deleteTransfer"
                          @cancel="isOpenDeleteWarning = false"
    ></delete-warning-modal>
  </v-list-item>
</template>

<script lang="ts" setup>

import {Transfer} from "../../../../store/models/Transfer";
import {defineProps, ref} from "vue";
import {useTransferStore} from "../../../../store/TransferStore";
import DeleteWarningModal from "./modal-windows/delete-warning-modal.vue";

interface IProps {
  transfer: Transfer
}

const props = withDefaults(defineProps<IProps>(), {
  transfer: () => new Transfer()
})

const emit = defineEmits(['click'])

const transferStore = useTransferStore()
const isOpenDeleteWarning = ref(false)

const deleteTransfer = () => {
  isOpenDeleteWarning.value = false
  transferStore.deleteTransfer()
}
</script>

<style lang="scss" scoped>

</style>