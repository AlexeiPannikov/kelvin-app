<template>
  <div class="login-page d-flex align-center justify-center">
    <v-dialog persistent
    >
      <template #activator="{ props }">
        <button-blue size="x-large" v-bind="props">Log in</button-blue>
      </template>
      <v-card min-width="400">
        <v-card-title>
          <h2 class="text-center">Log in</h2>
        </v-card-title>
        <v-card-text>
          <v-form v-model="isValid"
                  ref="form"
                  lazy-validation
          >
            <v-container>
              <v-row>
                <v-col
                    cols="12"
                >
                  <v-text-field
                      v-model="loginData.email"
                      :rules="[isEmail]"
                      label="Email"
                      required
                      @keydown.enter="focusOnPassword"
                      ref="emailInput"
                      :autofocus="true"
                  ></v-text-field>
                </v-col>

                <v-col
                    cols="12"
                >
                  <v-text-field
                      v-model="loginData.password"
                      label="Password"
                      :rules="[required]"
                      :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showPass ? 'text' : 'password'"
                      @click:append-inner="showPass = !showPass"
                      required
                      ref="passwordInput"
                      @keydown.enter="focusOnButton"
                      @keydown="backspaceHandler"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <button-blue @click="login"
                       :is-loading="store.isLoadingLoginUser"
                       ref="buttonEnter"
          >
            Log in
          </button-blue>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import ButtonBlue from "../../components/buttons/button-blue.vue";
import {onMounted, ref, watch} from "vue";
import {isEmail, required} from "../../../functions/ValidationRules"
import {useCurrentUserStore} from "../../../store/CurrentUserStore";
import {useRouter} from "vue-router";
import {loginData} from "./state/LoginDataState"
import {ipcRenderer} from "electron";
import {PrimarySettings} from "./models/PrimarySettings";

const isValid = ref(false)
const showPass = ref(false)
const form = ref(null)
const passwordInput = ref(null)
const emailInput = ref(null)
const buttonEnter = ref(null)
const store = useCurrentUserStore()

const router = useRouter()

const login = async () => {
  form?.value.validate()
  if (isValid.value) {
    const res = await store.login(loginData)
    if (res) {
      await store.getCurrentUser()
      const userId = store.currentUser.id
      const settings: PrimarySettings = await ipcRenderer.invoke("get-user-settings", userId)
      settings.folder ? await router.push("/") : await router.push("/primary-settings")
    }
  }
}

const focusOnPassword = () => {
  const [input] = passwordInput.value.$el.getElementsByTagName("input")
  input.focus()
}

const focusOnButton = () => {
  buttonEnter.value.$el.focus()
}

const backspaceHandler = (e: KeyboardEvent) => {
  if (e.key === "Backspace" && !loginData.password.length) {
    const [input] = emailInput.value.$el.getElementsByTagName("input")
    input.focus()
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  width: 100%;
  height: 100%;
}
</style>
