import $api from "../api";
import {BaseResponse} from "../models/responses/BaseResponse";
import {EditProductRequest} from "../models/requests/Products/EditProductRequest";
import {GetProductData} from "../models/responses/Products/GetProductData";

class ProductsService {

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
}

export default new ProductsService();
