<template>
  <v-navigation-drawer color="main-navigation-back"
                       width="80"
                       permanent
  >
    <div class="d-flex flex-column fill-height">
      <v-list class="pt-0 pb-4">
        <v-list-item class="d-flex align-center justify-center border-b"
                     width="79"
                     height="79"
                     :to="{name: 'capture'}"
        >
          <div class="bg-white icon-wrap">
            <v-icon color="main-content-back" size="20">mdi-camera</v-icon>
          </div>
        </v-list-item>
        <v-list-item class="d-flex align-center justify-center border-b"
                     width="79"
                     height="79"
                     :to="{name: 'style-guides'}"
        >
          <div class="bg-white icon-wrap">
            <v-icon color="main-content-back" size="20">mdi-book-open-blank-variant</v-icon>
          </div>
        </v-list-item>
      </v-list>
      <v-spacer></v-spacer>

      <team-on-set-modal></team-on-set-modal>
      <settings-modal></settings-modal>

    </div>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import TeamOnSetModal from "./modal-windows/team-on-set-menu.vue";
import SettingsModal from "./modal-windows/settings-menu.vue";

</script>

<style lang="scss" scoped>
.icon-wrap {
  width: 37px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: white;
}
</style>