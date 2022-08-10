<template>
  <v-container fluid class="position-relative fill-height">
    <ui-preloader :is-loading="styleGuidesStore.isLoadingStyleGuide" contained>
      <v-row>
        <v-col cols="12">
          <div class="d-flex">
            <div class="bg-white mr-4">
              <v-img width="150" :src="styleGuide.coverFile.url"></v-img>
            </div>
            <div>
              <div class="text-h5">
                {{ styleGuide.name.toLocaleUpperCase() }}
              </div>
              <div class="description" v-html="styleGuide.description"></div>
              <div class="d-flex align-center mt-3 file pointer"
                   v-for="file in styleGuide.filesInner"
                   :key="file.url"
                   @click="openInBrowser(file.url)"
              >
                <v-icon>mdi-file</v-icon>
                <div class="text-decoration-underline description"
                >
                  {{ file.original_name }}
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row justify="flex-end">
        <v-col>
          <ui-select
          >
          </ui-select>
        </v-col>
      </v-row>
    </ui-preloader>
  </v-container>
</template>

<script lang="ts" setup>
import UiPreloader from "../../../components/ui-preloader/ui-preloader.vue";
import {useStyleGuidesStore} from "../../../../store/StyleGuidesStore";
import {toRefs} from "vue";
import {openInBrowser} from "../../../../functions/openInBrowser"
import UiSelect from "../../../components/ui-select/ui-select.vue";

const styleGuidesStore = useStyleGuidesStore()
const {styleGuide} = toRefs(styleGuidesStore)

</script>

<style lang="scss" scoped>
.file {
  &:deep(.v-icon) {
    opacity: 0.6;
    transition: opacity 0.1s ease-in-out;
  }

  &:hover:deep(.v-icon) {
    opacity: 1;
  }
}
</style>