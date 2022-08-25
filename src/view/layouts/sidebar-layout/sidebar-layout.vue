<template>
  <v-navigation-drawer color="main-navigation-back"
                       width="80"
                       permanent
  >
    <div class="d-flex flex-column fill-height">
      <v-list class="pt-0 pb-4">
        <nav-button path-name="capture">
          mdi-camera
        </nav-button>
        <nav-button path-name="style-guides">
          mdi-book-open-blank-variant
        </nav-button>
        <nav-button path-name="reference-images">
          mdi-eye
        </nav-button>
        <nav-button path-name="transfer">
          mdi-arrow-up
        </nav-button>
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
import NavButton from "./components/nav-button.vue";

</script>

<style lang="scss" scoped>
</style>