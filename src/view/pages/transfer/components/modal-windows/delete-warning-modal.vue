<template>
  <v-dialog>
    <v-card width="500">
      <v-card-title>
        DELETE TRANSFER
      </v-card-title>
      <v-card-text>
        Are you sure you want to delete this transfer?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <button-white @click="emit('cancel')">Cancel</button-white>
        <button-blue @click="emit('ok')">Ok</button-blue>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import ButtonWhite from "../../../../components/buttons/button-white.vue";
import ButtonBlue from "../../../../components/buttons/button-blue.vue";

const emit = defineEmits(['ok', 'cancel'])
</script>

<style lang="scss" scoped>

</style>