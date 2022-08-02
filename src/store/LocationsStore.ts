import {TypeModel} from "../api/models/responses/Locations/TypeModel";
import {defineStore} from "pinia";
import {LocationModel} from "../api/models/responses/Locations/LocationModel";
import LocationsService from "../api/services/LocationsService";
import {GetLocationData} from "../api/models/responses/Locations/GetLocationData";
import {CountryModel} from "../api/models/responses/Locations/CountryModel";

interface IState {
    isLoadingLocations: boolean;
    isLoadingLocation: boolean;
    locations: LocationModel[];
    location: GetLocationData
    types: TypeModel[];
    countries: CountryModel[]
}

export const useLocationsStore = defineStore("locations", {
    state: () => {
        return <IState>{
            isLoadingLocations: false,
            isLoadingLocation: false,
            locations: new Array<LocationModel>(),
            location: new GetLocationData(),
            types: new Array<TypeModel>(),
            countries: new Array<CountryModel>()
        };
    },

    getters: {
        locationsSelectList(): { title: string, value: string }[] {
            if (!this.locations.length) return [];
            const array = this.locations.map(({uuid, name}) => ({title: name, value: uuid}))
            array.unshift({title: "No particular location", value: "0"})
            return array
        },

        subLocationsSelectList(): { title: string, value: string }[] {
            if (!this.location.subs.length) return [];
            const array = this.location.subs.map(({uuid, name}) => ({title: name, value: uuid}))
            array.unshift({title: "No particular location", value: "0"})
            return array
        },
    },

    actions: {
        async getLocations() {
            this.isLoadingLocations = true;
            try {
                const res = await LocationsService.getLocations();
                if (res) {
                    this.locations = res.locations;
                    this.types = res.types;
                    this.countries = res.countries;
                }
            } finally {
                this.isLoadingLocations = false;
            }
        },

        async getLocation(uuid: string) {
            this.isLoadingLocation = true;
            try {
                const res = await LocationsService.getLocation(uuid);
                if (res) {
                    const {location, subs} = res;
                    this.location.location = location
                    this.location.subs = subs
                    return true;
                }
            } finally {
                this.isLoadingLocation = false;
            }
        },

        resetSubLocations() {
            this.location.subs.splice(0)
        }
    },
});
