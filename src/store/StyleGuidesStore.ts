import FilesService from "../api/services/FilesService";
import {StyleGuide} from "../api/models/responses/StyleGuides/StyleGuide";
import {defineStore} from "pinia";
import StyleGuidesService from "../api/services/StyleGuidesService";
import {useStudioStore} from "./StudioStore";
import {viewStyleGuide} from "./methods/StyleGuides";

interface IState {
    isLoadingStyleGuides: boolean;
    isLoadingStyleGuide: boolean;
    isFirstLoading: boolean
    styleGuides: StyleGuide[];
    styleGuide: StyleGuide;
    selectedShootingTypeUuid: string
}

export const useStyleGuidesStore = defineStore("style-guides", {
    state: () => {
        return {
            isLoadingStyleGuides: false,
            isLoadingStyleGuide: false,
            isFirstLoading: true,
            styleGuides: new Array<StyleGuide>(),
            styleGuide: new StyleGuide(),
            selectedShootingTypeUuid: ""
        } as IState;
    },

    getters: {
        getStyleGuideProductionTypesSelectList(): { title: string, value: string }[] {
            const studioStore = useStudioStore()
            return studioStore.productionTypes
                .filter(({uuid}) => !!this.styleGuide.shootingTypes
                    .find(({production_type_uuid}) => production_type_uuid === uuid))
                .map(({uuid, name}) => ({title: name, value: uuid}))
        }
    },

    actions: {

        async getStyleGuides(clientId: number) {
            this.isLoadingStyleGuides = true;
            try {
                const res = await StyleGuidesService.getStyleGuides(clientId);
                if (res) {
                    this.styleGuides = res.map(item => new StyleGuide(item));
                    this.styleGuides.forEach(item => console.log(item.getAllFiles()))
                    await FilesService.filesDownloader("styleguide", this.styleGuides.map((styleGuide) => styleGuide.getAllFiles()).flat())
                }
            } finally {
                this.isLoadingStyleGuides = false;
            }
        },

        async viewStyleGuide(uuid: string) {
            this.isLoadingStyleGuide = true
            this.styleGuide = await viewStyleGuide({uuid})
            this.isLoadingStyleGuide = false
        },
    },
});
