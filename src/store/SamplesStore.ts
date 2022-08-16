import {PropertyModel} from "../api/models/responses/Properties/PropertyModel";
import SamplesService from "../api/services/SamplesService";
import {SampleModel} from "../api/models/responses/Samples/SampleModel";
import {defineStore} from "pinia";
import {useColumnsStore} from "./ColumnsStore";
import Notifications from "../view/components/ui-notifications/models/Notifications";
import {useJobsStore} from "./JobsStore";
import {search} from "./methods/Samples";

export const useSampleStore = defineStore("samples", {
    state: () => {
        return {
            isLoadingSample: false,
            isLoadingSearchSamples: false,
            samples: new Array<SampleModel>(),
            properties: new Array<PropertyModel>(),
            sample: new SampleModel(),
            barcode: "",
            checkInCheckOutList: new Array<SampleModel>(),
            checkedInList: new Array<SampleModel>(),
            checkedOutList: new Array<SampleModel>(),
            toDoList: new Array<SampleModel>(),
            processedList: new Array<SampleModel>(),
            isNextPage: true,
            page: 1,
        };
    },

    getters: {
        filteredColumns(): any[][] {
            const columnsStore = useColumnsStore();
            return Object.entries(columnsStore.columns).filter(([key]) => {
                for (const item of this.samples) {
                    if (
                        Object.prototype.hasOwnProperty.call(item, key) &&
                        (item as any)[key] !== null &&
                        (item as any)[key] !== undefined
                    ) {
                        return true;
                    }
                }
            });
        },

        sampleProperties(): { internal_name: string, name: string, value: any }[] {
            if (!this.sample) return
            return this.properties.map(prop => {
                    return {
                        internal_name: prop.internal_name,
                        name: prop.name,
                        value: this.sample[prop.internal_name as keyof SampleModel]
                    }
                }
            ).filter(item => item.value);
        },
    },

    actions: {

        async getSample(uuid: string) {
            this.isLoadingSample = true;
            try {
                const res = await SamplesService.getSample(uuid);
                if (res) {
                    this.sample = new SampleModel(res);
                    return res;
                }
            } finally {
                this.isLoadingSample = false;
            }
        },

        async search(barcode?: string): Promise<boolean> {
            this.isLoadingSearchSamples = true;
            this.samples = await search({barcode})
            this.isLoadingSearchSamples = false;
            if (!this.samples) return true
        },
    },
});
