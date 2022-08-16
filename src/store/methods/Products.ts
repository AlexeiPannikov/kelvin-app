import {useColumnsStore} from "../ColumnsStore";
import ProductsService from "../../api/services/ProductsService";
import {ProductModel} from "../../api/models/responses/Products/ProductModel";
import {PropertyModel} from "../../api/models/responses/Properties/PropertyModel";

interface IParamsGetProducts {
    free_text: string
}

interface IParamsGetProduct {
    uuid: string
}

export const getProducts = async ({free_text}: IParamsGetProducts): Promise<[ProductModel[], PropertyModel[]]> => {
    const products: ProductModel[] = []
    const properties: PropertyModel[] = []
    try {
        const res = await ProductsService.getProducts(free_text);
        if (res) {
            products.push(...res.list.data);
            properties.push(...res.properties)
        }
    } catch (e) {
        console.log(e)
    }
    return [products, properties]
}

export const getProduct = async ({uuid}: IParamsGetProduct) => {
    let product = new ProductModel()
    try {
        const res = await ProductsService.getProduct(uuid);
        if (res) {
            product = res.product;
        }
    } catch (e) {
        console.log(e)
    }
    return product
}