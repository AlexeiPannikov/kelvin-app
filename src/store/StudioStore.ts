import {defineStore} from "pinia";
import {ProductionType} from "../api/models/ProductionType";
import StudioService from "../api/services/StudioService";

export const useStudioStore = defineStore("studio", {
    state: () => {
        return {
            isLoadingProductionTypes: false,
            productionTypes: new Array<ProductionType>(),
            selectedProductionTypeUuid: ""
        };
    },

    getters: {
        enabledProductionTypesSelectList(): { title: string, value: string }[] {
            if (!this.productionTypes.length) return
            return this.productionTypes.filter(({is_enabled}) => is_enabled)
                .map(({name, uuid}) => ({title: name, value: uuid}))
        },

        productionTypeName(): string {
            return this.productionTypes.find(({uuid}) => this.selectedProductionTypeUuid === uuid)?.name
        }
    },

    actions: {
        async getProductionTypes() {
            this.isLoadingProductionTypes = true;
            try {
                const res = await StudioService.getProductionTypes();
                if (res) {
                    this.productionTypes = res.map((item) => new ProductionType(item));
                    const savedUuid = this.getSavedProductionType()
                    this.setAndSaveProductionType(savedUuid || this.enabledProductionTypesSelectList[0]?.value)
                }
            } finally {
                this.isLoadingProductionTypes = false;
            }
        },

        setAndSaveProductionType(uuid?: string) {
            this.selectedProductionTypeUuid = uuid || this.selectedProductionTypeUuid
            const isExist = !!this.productionTypes.find((item) => item.uuid === this.selectedProductionTypeUuid)
            if (!isExist) this.selectedProductionTypeUuid = ""
            localStorage.setItem("productionType", this.selectedProductionTypeUuid)
        },

        getSavedProductionType() {
            return localStorage.getItem("productionType")
        }
    },
});
