<template>
  <v-menu
      v-model="isOpenUserMenu"
      :close-on-content-click="false"
      location="end"
  >
    <template v-slot:activator="{ props }">
      <v-avatar class="align-self-center pointer"
                color="grey"
                v-bind="props"
      >
        <span class="text-white">{{ nameFirstLetters }}</span>
      </v-avatar>
    </template>
    <v-card class="ml-3"
            min-width="300"
            color="black"
    >
      <v-card-title class="d-flex justify-space-between align-center">
        <span>TEAM ON SET</span>
        <button-blue size="small">Edit</button-blue>
      </v-card-title>
      <v-list bg-color="black">
        <v-list-item>
          <v-list-item-subtitle>role</v-list-item-subtitle>
          {{ currentUser.name }}
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script lang="ts" setup>
import { ref, toRefs} from "vue";
import {useCurrentUserStore} from "../../../../store/CurrentUserStore";
import {useFirstNameLetters} from "../../../../functions/useFirstNameLetters";
import ButtonBlue from "../../../components/buttons/button-blue.vue";

const isOpenUserMenu = ref(false)
const currentUserStore = useCurrentUserStore()
const {currentUser} = toRefs(currentUserStore)

const nameFirstLetters = useFirstNameLetters(currentUser.value.name)
</script>

<style lang="scss" scoped>

</style>