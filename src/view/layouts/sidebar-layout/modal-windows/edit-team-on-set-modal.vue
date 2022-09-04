<template>
  <v-dialog persistent
  >
    <v-card width="600">
      <v-card-title class="border-b">
        TEAM ON SET
      </v-card-title>
      <v-card-item>
        <v-autocomplete density="compact"
                        hide-details
                        variant="outlined"
                        placeholder="SEARCH & ADD USERS"
                        single-line
                        prepend-inner-icon="mdi-account"
                        :items="userList"
                        @update:modelValue="select"
                        hide-selected
        >
        </v-autocomplete>
        <div style="min-height: 100px">
          <div class="d-flex mt-4 align-center"
               v-for="member in teamOnSetStore.teamOnSetTempList"
               :key="member.id"
          >
            <v-avatar
                color="grey"
                size="60"
            >
              <span class="text-white text-h5">{{ useFirstNameLetters(member.name).value }}</span>
            </v-avatar>
            <div class="ml-4">{{ member.name }}</div>
            <v-spacer></v-spacer>
            <div>
              <button-white density="compact"
                            @click="remove(member.id)"
              >
                Remove
              </button-white>
            </div>
          </div>
        </div>
      </v-card-item>
      <v-card-actions class="pt-5">
        <span class="text-h5 px-4">SHOOTING</span>
        <ui-select :items="studioStore.enabledProductionTypesSelectList"
                   v-model="prodTypeUuid"
                   :loading="studioStore.isLoadingProductionTypes"
                   variant="outlined"
        >
        </ui-select>
        <v-spacer></v-spacer>
        <button-white @click="cancel">Cancel</button-white>
        <button-blue @click="confirm"
                     :disabled="!teamOnSetStore.teamOnSetTempList.length"
        >OK
        </button-blue>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import ButtonBlue from "../../../components/buttons/button-blue.vue";
import UiSelect from "../../../components/ui-select/ui-select.vue";
import {useStudioStore} from "../../../../store/StudioStore";
import {useUsersStore} from "../../../../store/UsersStore";
import {computed, ref, useAttrs, watch} from "vue";
import {useTeamOnSetStore} from "../../../../store/TeamOnSetStore";
import {MemberOfTheTeam} from "../../../../store/models/MemberOfTheTeam";
import ButtonWhite from "../../../components/buttons/button-white.vue";
import {useFirstNameLetters} from "../../../../functions/useFirstNameLetters";

const studioStore = useStudioStore()
const usersStore = useUsersStore()
const teamOnSetStore = useTeamOnSetStore()
const selectedUser = ref<number>(null)
const prodTypeUuid = ref("")
const attrs = useAttrs()

const emit = defineEmits(['cancel'])

watch(() => attrs.modelValue, () => {
  if (attrs.modelValue) {
    prodTypeUuid.value = studioStore.selectedProductionTypeUuid
  }
})

const userList = computed(() =>
    usersStore.usersSelectList.filter(({value}) => !teamOnSetStore.teamOnSetTempList.find(({id}) => id === value))
)

const select = (data: number) => {
  selectedUser.value = data
  if (selectedUser.value) {
    const user = usersStore.users.find(({id}) => id === selectedUser.value)
    teamOnSetStore.addInTempList(new MemberOfTheTeam({name: user.name, id: user.id}))
    selectedUser.value = null
  }
}

const confirm = () => {
  teamOnSetStore.addMembersOnTeam()
  studioStore.selectedProductionTypeUuid = prodTypeUuid.value
  emit("cancel")
}

const cancel = () => {
  teamOnSetStore.resetTempList()
  emit("cancel")
}

const remove = (id: number) => {
  teamOnSetStore.deleteMemberFromTeam(id)
}
</script>

<style lang="scss" scoped>

</style>