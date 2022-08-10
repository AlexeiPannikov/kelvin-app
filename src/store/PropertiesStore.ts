import {defineStore} from "pinia";
import {GetAllPropertiesResponse} from "../api/models/responses/Properties/GetAllPropertiesResponse";
import {EditPropertyRequest} from "../api/models/requests/Properties/EditPropertyRequest";
import PropertiesService from "../api/services/PropertiesService";
import {PropertyModel} from "../api/models/responses/Properties/PropertyModel";
import {EntityModel} from "../api/models/responses/Properties/EntityModel";
import {AddPropertyRequest} from "../api/models/requests/Properties/AddPropertyRequest";
import Notifications from "../view/components/ui-notifications/models/Notifications";

interface IState {
    isLoadingProperties: boolean;
    isLoadingEntities: boolean;
    isLoadingAddEditDeleteProperty: boolean;
    allProperties: GetAllPropertiesResponse[];
    properties: PropertyModel[];
    property: PropertyModel;
    entities: EntityModel[];
    addEditPropertyData: PropertyModel;
    mode: "add" | "edit";
}

export const usePropertiesStore = defineStore("properties", {
    state: () => {
        return {
            isLoadingProperties: false,
            isLoadingEntities: false,
            isLoadingAddEditDeleteProperty: false,
            allProperties: [new GetAllPropertiesResponse()],
            properties: new Array<PropertyModel>(),
            property: null,
            entities: new Array<EntityModel>(),
            addEditPropertyData: new PropertyModel(),
            mode: null,
        } as IState;
    },

    getters: {
        customProperties(): PropertyModel[] {
            return this.properties.filter(({is_default}) => !is_default);
        },

        defaultProperties(): PropertyModel[] {
            return this.properties.filter(({is_default}) => is_default);
        },
    },

    actions: {
        async getProperties(entityId: string | number = 1) {
            this.isLoadingProperties = true;
            this.isLoadingEntities = true;
            try {
                const res = await PropertiesService.getProperties(entityId);
                if (res) {
                    this.properties = res.properties;
                    this.entities = res.entities;
                    return res.properties;
                }
            } finally {
                this.isLoadingProperties = false;
                this.isLoadingEntities = false;
            }
        },

        async getAllProperties() {
            this.isLoadingProperties = true;
            this.isLoadingEntities = true;
            try {
                const res = await PropertiesService.getAllProperties();
                if (res) {
                    this.allProperties = res.map(item => (new GetAllPropertiesResponse(item)))
                }
            } finally {
                this.isLoadingProperties = false;
                this.isLoadingEntities = false;
            }
        },

        async addProperty(): Promise<boolean> {
            this.isLoadingAddEditDeleteProperty = true;
            try {
                const {type, name, internal_name, entity_id, options} =
                    this.addEditPropertyData;
                const res = await PropertiesService.addProperty(
                    new AddPropertyRequest({
                        type,
                        name,
                        entity_id,
                        internal_name,
                        options
                    })
                );
                if (res) {
                    Notifications.newMessage(res);
                    return true;
                }
            } finally {
                this.isLoadingAddEditDeleteProperty = false;
            }
        },

        async editProperty(propertyId: string | number): Promise<boolean> {
            this.isLoadingAddEditDeleteProperty = true;
            try {
                const {type, name, internal_name, options} = this.addEditPropertyData;
                const res = await PropertiesService.editProperty(
                    propertyId,
                    new EditPropertyRequest({
                        type,
                        name,
                        internal_name,
                        options
                    })
                );
                if (res) {
                    Notifications.newMessage(res);
                    return true;
                }
            } finally {
                this.isLoadingAddEditDeleteProperty = false;
            }
        },

        async deleteProperty(): Promise<boolean> {
            this.isLoadingAddEditDeleteProperty = true;
            try {
                const res = await PropertiesService.deleteProperty(this.property.id);
                if (res) {
                    Notifications.newMessage(
                        `Property ${
                            this.properties.find(({id}) => id == this.property.id).name
                        } deleted`
                    );
                    this.properties = this.properties.filter(({id}) => id !== this.property.id)
                    return true;
                }
            } finally {
                this.isLoadingAddEditDeleteProperty = false;
            }
        },
    },
});
