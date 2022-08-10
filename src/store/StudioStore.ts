import {defineStore} from "pinia";
import {ProductionType} from "../api/models/ProductionType";
import StudioService from "../api/services/StudioService";

export const useStudioStore = defineStore("studio", {
    state: () => {
        return {
            isLoadingProductionTypes: false,
            productionTypes: new Array<ProductionType>(),
        };
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
