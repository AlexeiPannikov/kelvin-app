<template>
  <cropper
      class="cropper"
      :stencil-props="stencilProps"
  >
  </cropper>
</template>

<script lang="ts" setup>
import {Cropper} from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';

const stencilProps = {
  linesClasses: {
    north: 'line--north',
    west: 'line--west',
    south: 'line--south',
    east: 'line--east',
  },
  handlersClasses: {
    eastNorth: 'handler--east-north',
    north: 'handler--north',
    westNorth: 'handler--west-north',
    west: 'handler--west',
    westSouth: 'handler--west-south',
    south: 'handler--south',
    eastSouth: 'handler--east-south',
    east: 'handler--east',
  },
}
</script>

<style lang="scss">
.vue-advanced-cropper__background, .vue-advanced-cropper__foreground {
  background-color: inherit !important;
}

.boundaries {
  background-color: #0d47a1;
}

.line--north, .line--west, .line--south, .line--east {
  background-color: rgb(var(--v-theme-primary));
}

.handler--east-north, .handler--north, .handler--west-north, .handler--west, .handler--west-south, .handler--south, .handler--east-south, .handler--east {
  border-width: 1px;
  border-style: solid;
  border-color: rgb(var(--v-theme-primary));
  background-color: transparent;
}
</style>