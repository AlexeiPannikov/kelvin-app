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
        }
    },

    actions: {
        async getProductionTypes() {
            this.isLoadingProductionTypes = true;
            try {
                const res = await StudioService.getProductionTypes();
                if (res) {
                    this.productionTypes = res.map((item) => new ProductionType(item));
                }
            } finally {
                this.isLoadingProductionTypes = false;
            }
        }
    },
});
