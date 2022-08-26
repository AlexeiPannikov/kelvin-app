<template>
  <div>
    <v-card flat class="border-b pt-2">
      <v-card-title>
        General
      </v-card-title>
      <v-card-subtitle>
        When invoking "Transfer" on the capture screen
      </v-card-subtitle>
      <v-card-item class="pb-6">
          <v-select variant="outlined"
                    density="compact"
                    hide-details
                    :items="behaviourAfterTransferList"
                    v-model="userSettingsStore.primarySettings.behaviourAfterTransfer"
          ></v-select>
      </v-card-item>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import {useUserSettingsStore} from "../../../../../store/UserSettingsStore";
import {BehaviourAfterTransferEnum} from "../../../../../store/models/BehaviourAfterTransferEnum";

const userSettingsStore = useUserSettingsStore()

const behaviourAfterTransferList = [
  {title: "Go to Transfer view", value: BehaviourAfterTransferEnum.Go},
  {title: "Stay on Capture view", value: BehaviourAfterTransferEnum.Stay},
]
</script>

<style lang="scss" scoped>

</style>