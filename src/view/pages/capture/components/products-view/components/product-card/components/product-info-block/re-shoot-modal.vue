<template>
  <v-dialog>
    <v-card width="1000">
      <v-card-title>
        RE-SHOOT
      </v-card-title>
      <v-card-item class="pl-0 position-relative">
        <ui-preloader :is-loading="tasksStore.isLoadingTask" contained>
          <div class="d-flex">
            <div class="d-flex flex-column px-4">
              <div v-for="(item, i) in tasksStore.taskData.rejectedFiles"
                   :key="i"
                   class="mt-3 pointer"
                   :class="{selected: selectedItem?.file_original_uuid === item?.file_original_uuid}"
              >
                <v-img
                    :src="item.fileOriginal.url"
                    aspect-ratio="1"
                    width="140"
                    @click="selectedItem = item"
                >
                </v-img>
              </div>
            </div>
            <div class="px-5">
              <div class="text-h6 mb-2">Rejection information</div>
              <v-img aspect-ratio="1"
                     class="bg-white"
                     width="400"
                     :src="selectedItem?.fileEdited.url"
              >
              </v-img>
            </div>
            <div class="pt-7">
              <template v-if="selectedItem?.reason">
                <v-chip v-if="data"
                        :label="data"
                        color="primary"
                >
                </v-chip>
                <div class="text-h6">{{
                    tasksStore.taskData?.production?.steps?.find(({step}) => step === "Final selection")?.team.find(({is_primary}) => is_primary)?.name
                  }}
                </div>
                <div class="font-italic">
                  {{ selectedItem?.reason }}
                </div>
              </template>
              <div v-else class="font-italic">
                No rejection reason added
              </div>
            </div>
          </div>
        </ui-preloader>
      </v-card-item>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="emit('close')"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>

import {useTasksStore} from "../../../../../../../../../store/TasksStore";
import {computed, ref, watch} from "vue";
import {RejectedFile} from "../../../../../../../../../api/models/requests/Tasks/RejectedFile";
import UiPreloader from "../../../../../../../../components/ui-preloader/ui-preloader.vue";

const emit = defineEmits(["close"])

const tasksStore = useTasksStore()
const selectedItem = ref<RejectedFile>(null)

const data = computed(() => tasksStore.taskData.production.steps.find(({step}) => step === 'Final selection')?.finished_at)

watch(() => tasksStore.taskData.rejectedFiles, () => {
      if (tasksStore.taskData.rejectedFiles.length) {
        selectedItem.value = tasksStore.taskData.rejectedFiles[0]
      }
    }
    , {deep: true})
</script>

<style lang="scss" scoped>
.selected {
  border: 1px solid rgb(var(--v-theme-primary));
}
</style>