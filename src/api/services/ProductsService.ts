import $api from "../api";
import {BaseResponse} from "../models/responses/BaseResponse";
import {EditProductRequest} from "../models/requests/Products/EditProductRequest";
import {GetProductData} from "../models/responses/Products/GetProductData";
import {GetProductsData} from "../models/responses/Products/GetProductsData";
import {TransferRequest} from "../models/requests/Products/TransferRequest";
import {ConfirmProductResponse} from "../models/responses/Products/ConfirmProductResponse";
import {GetProductProductionsResponse} from "../models/responses/Products/GetProductProductionsResponse";

interface ITransferArgs {
    product_uuid: string,
    production_type_uuid: string,
    data: TransferRequest
}

class ProductsService {

    async getProducts(free_text: string): Promise<GetProductsData> {
        const res = await $api.post<BaseResponse<GetProductsData>>("products", {
            properties: [
                {id: null, value: null}
            ]
        }, {params: {free_text}});
        if (res?.data.success) {
            return res.data.data;
        }
    }

    async getProduct(uuid: string): Promise<GetProductData> {
        const res = await $api.get<BaseResponse<GetProductData>>(
            `products/${uuid}`
        );
        if (res?.data.success) {
            return res.data.data;
        }
    }

    async editProduct(uuid: string, data: EditProductRequest): Promise<boolean> {
        const res = await $api.put<BaseResponse<any>>(`products/${uuid}`, data);
        if (res?.data?.success) {
            return res.data.success;
        }
    }

    async confirmProduct(uuid: string): Promise<ConfirmProductResponse[]> {
        const res = await $api.get<BaseResponse<ConfirmProductResponse[]>>(`products/${uuid}/confirm`)
        if (res?.data?.success) {
            return res.data.data
        }
    }

    async beginTransfer(product_uuid: string, production_type_uuid: string): Promise<boolean> {
        const res = await $api.get<{ success: boolean }>(`products/${product_uuid}/${production_type_uuid}/transfer`)
        if (res?.data) {
            return res.data.success
        }
    }

    async transfer({product_uuid, production_type_uuid, data}: ITransferArgs): Promise<boolean> {
        const res = await $api.post<{ success: boolean }>(`products/${product_uuid}/${production_type_uuid}/transfer`, data)
        if (res?.data) {
            return res.data.success
        }
    }

    async getProductProductions(product_uuid: string): Promise<GetProductProductionsResponse[]> {
        const res = await $api.get<BaseResponse<GetProductProductionsResponse[]>>(`products/${product_uuid}/production`)
        if (res?.data) {
            return res.data.data
        }
    }
}

export default new ProductsService();
