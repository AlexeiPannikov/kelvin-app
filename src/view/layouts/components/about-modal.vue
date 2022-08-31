<template>
  <v-dialog>
    <v-card flat width="500">
      <v-card-text class="pt-10">
        <div class="d-flex flex-column align-center justify-center">
          <h3 class="text-h3 font-weight-light">
            KELVIN
          </h3>
        </div>
      </v-card-text>
      <v-card-subtitle class="d-flex justify-center">
        Version {{version}}
      </v-card-subtitle>
      <v-card-actions>
        <v-spacer></v-spacer>
        <button-blue @click="emit('ok')">Ok</button-blue>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import ButtonBlue from "../../components/buttons/button-blue.vue";
import {onMounted, ref} from "vue";
const version = ref(null)

const emit = defineEmits(["ok"])

onMounted(() => {
  version.value = process.env.npm_package_version
})
</script>

<style lang="scss" scoped>

</style>