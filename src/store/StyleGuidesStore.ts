import FilesService from "../api/services/FilesService";
import {StyleGuide} from "../api/models/responses/StyleGuides/StyleGuide";
import {Position} from "../api/models/requests/StyleGuides/Position";
import {defineStore} from "pinia";
import {ShootingType} from "../api/models/requests/StyleGuides/ShootingType";
import StyleGuidesService from "../api/services/StyleGuidesService";
import {useStudioStore} from "./StudioStore";

interface IState {
    isLoadingStyleGuides: boolean;
    isLoadingStyleGuide: boolean;
    styleGuides: StyleGuide[];
    styleGuide: StyleGuide;
    selectedShootingTypeUuid: string
}

export const useStyleGuidesStore = defineStore("style-guides", {
    state: () => {
        return {
            isLoadingStyleGuides: false,
            isLoadingStyleGuide: false,
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
            if (!uuid) return
            this.isLoadingStyleGuide = true;
            try {
                const res = await StyleGuidesService.viewStyleGuide(uuid);
                if (res) {
                    this.styleGuide = new StyleGuide(res.style_guide)
                    this.styleGuide.shootingTypes = res.shootingTypes?.map(item => new ShootingType({
                        ...item,
                        positions: item.positions.map(position => new Position(position))
                    }))
                    await FilesService.filesDownloader("styleguide", this.styleGuide.getAllFiles())
                }
            } finally {
                this.isLoadingStyleGuide = false;
            }
        },
    },
});
