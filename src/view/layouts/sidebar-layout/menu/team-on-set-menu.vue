<template>
  <v-menu
      v-model="isOpenUserMenu"
      :close-on-content-click="false"
      location="end"
  >
    <template v-slot:activator="{ props }">
      <div class="d-flex flex-column align-center">
        <v-avatar class="align-self-center pointer user-avatar"
                  color="grey"
                  v-bind="props"
                  v-for="(member, i) in reverseList"
                  :key="member.id"
                  :style="{transform: `translateY(${20 * (reverseList.length - 1 - i)}px)`}"
        >
          <span class="text-white">{{ useFirstNameLetters(member.name).value }}</span>
        </v-avatar>
      </div>
    </template>
    <v-card class="ml-3"
            min-width="300"
            color="black"
    >
      <v-card-title class="d-flex justify-space-between align-center">
        <span>TEAM ON SET</span>
        <button-blue size="small"
                     @click="isOpenEditTeamOnSetModal = true"
        >Edit
        </button-blue>
      </v-card-title>
      <v-list bg-color="black">
        <v-list-item v-for="member in teamOnSetStore.teamOnSet">
          <v-list-item-subtitle>role</v-list-item-subtitle>
          {{ member.name }}
        </v-list-item>
      </v-list>
    </v-card>

    <edit-team-on-set-modal v-model="isOpenEditTeamOnSetModal"
                       @cancel="isOpenEditTeamOnSetModal = false"
    ></edit-team-on-set-modal>
  </v-menu>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";
import {useFirstNameLetters} from "../../../../functions/useFirstNameLetters";
import ButtonBlue from "../../../components/buttons/button-blue.vue";
import EditTeamOnSetModal from "../modal-windows/edit-team-on-set-modal.vue";
import {useTeamOnSetStore} from "../../../../store/TeamOnSetStore";

const isOpenUserMenu = ref(false)
const isOpenEditTeamOnSetModal = ref(false)
const teamOnSetStore = useTeamOnSetStore()

const reverseList = computed(() => ([...teamOnSetStore.teamOnSet].reverse()))
</script>

<style lang="scss" scoped>
.user-avatar {
  border: 2px solid rgb(var(--v-theme-main-navigation-back));
  transition: margin 0.2s ease-in-out;

  &:not(:last-child):hover {
    margin-bottom: 20px;
  }
}
</style>