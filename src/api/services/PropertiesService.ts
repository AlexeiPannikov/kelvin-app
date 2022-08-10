import $api from "../api";
import {BaseResponse} from "../models/responses/BaseResponse";
import {GetAllPropertiesResponse} from "../models/responses/Properties/GetAllPropertiesResponse";
import {EditPropertyRequest} from "../models/requests/Properties/EditPropertyRequest";
import {EditPropertyResponse} from "../models/responses/Properties/EditPropertyResponse";
import {AddPropertyResponse} from "../models/responses/Properties/AddPropertyResponse";
import {EntityModel} from "../models/responses/Properties/EntityModel";
import {PropertyModel} from "../models/responses/Properties/PropertyModel";
import {GetPropertiesData} from "../models/responses/Properties/GetPropertiesData";
import {AddPropertyRequest} from "../models/requests/Properties/AddPropertyRequest";

class PropertiesService {
    async getProperties(entityId: string | number): Promise<{
        entities: EntityModel[];
        properties: PropertyModel[];
    }> {
        const res = await $api.get<BaseResponse<GetPropertiesData>>(
            `properties/entity/${entityId}`
        );
        if (res?.data?.success) {
            return res.data.data;
        }
    }

    async getAllProperties(): Promise<GetAllPropertiesResponse[]> {
        const res = await $api.get<BaseResponse<GetAllPropertiesResponse[]>>(
            `properties/list`
        );
        if (res?.data?.success) {
            return res.data.data;
        }
    }

    async editProperty(
        propertyId: string | number,
        data: EditPropertyRequest
    ): Promise<string> {
        const res = await $api.put<EditPropertyResponse>(`properties/${propertyId}`, data);
        if (res?.data?.success) {
            return res.data.message;
        }
    }

    async addProperty(data: AddPropertyRequest): Promise<string> {
        const res = await $api.post<AddPropertyResponse>("properties", data);
        if (res?.data?.success) {
            return res.data.message;
        }
    }

    async deleteProperty(propertyId: string | number): Promise<boolean> {
        const res = await $api.delete<any>(`properties/${propertyId}`);
        if (res?.data?.success) {
            return true;
        }
    }
}

export default new PropertiesService();
