import {defineStore} from "pinia";
import {EditProductRequest} from "../api/models/requests/Products/EditProductRequest";
import ProductsService from "../api/services/ProductsService";
import Notifications from "../view/components/ui-notifications/models/Notifications";
import {ProductModel} from "../api/models/responses/Products/ProductModel";
import {PropertyRequestModel} from "../api/models/requests/Properties/PropertyRequestModel";
import {useColumnsStore} from "./ColumnsStore";
import {EditProductDataModel} from "../api/models/requests/Products/EditProductDataModel";
import {PropertyModel} from "../api/models/responses/Properties/PropertyModel";
import {getProduct, getProducts} from "./methods/Products";

interface IState {
    isLoadingProduct: boolean;
    isLoadingProducts: boolean;
    isLoadingEditProducts: boolean;
    products: ProductModel[];
    product: ProductModel;
    properties: PropertyModel[];
    editProductData: EditProductDataModel;
    isNextPage: boolean;
    page: number;
}

export const useProductsStore = defineStore("products", {
    state: () => {
        return {
            isLoadingProduct: false,
            isLoadingProducts: false,
            isLoadingEditProducts: false,
            product: null,
            products: new Array<ProductModel>(),
            properties: new Array<PropertyModel>(),
            editProductData: new EditProductDataModel(),
            isNextPage: true,
            page: 1,
        } as IState;
    },

    getters: {
        filteredColumns(): any[][] {
            const columnsStore = useColumnsStore();
            return Object.entries(columnsStore.columns).filter(([key]) => {
                for (const item of this.products) {
                    if (
                        Object.prototype.hasOwnProperty.call(item, key) &&
                        (item as any)[key] !== null &&
                        (item as any)[key] !== undefined &&
                        key !== "checkin_diff" &&
                        key !== "checkin_percent"
                    ) {
                        return true;
                    }
                }
            });
        },

        productProperties(): { internal_name: string, name: string, value: any }[] {
            if (!this.product) return []
            return this.properties.map(prop => {
                    return {
                        internal_name: prop.internal_name,
                        name: prop.name,
                        value: this.product[prop.internal_name as keyof ProductModel]
                    }
                }
            ).filter(item => item.value);
        },
    },

    actions: {
        async getProducts(free_text: string) {
            this.isLoadingProducts = true;
            const [products, properties] = await getProducts({free_text})
            this.products = products
            this.properties = properties
            this.isLoadingProducts = false;
        },

        async getProduct(uuid: string) {
            this.isLoadingProduct = true;
            this.product = await getProduct({uuid})
            this.isLoadingProduct = false;
        },

        async editProduct() {
            this.isLoadingEditProducts = true;
            const {properties, isActive, settings} = this.editProductData;
            try {
                const res = await ProductsService.editProduct(
                    this.product.product_uuid,
                    new EditProductRequest({
                        is_active: isActive,
                        status: settings.status,
                        styleguide_uuid: settings.styleGuideUuid,
                        properties: [
                            ...properties.map(
                                ({propertyId, valueDependingOfType}) =>
                                    new PropertyRequestModel(
                                        propertyId,
                                        valueDependingOfType || ""
                                    )
                            ),
                            ...settings.properties.map(
                                ({propertyId, valueDependingOfType}) =>
                                    new PropertyRequestModel(
                                        propertyId,
                                        valueDependingOfType || ""
                                    )
                            ),
                        ],
                    })
                );
                if (res) {
                    Notifications.newMessage("Product edited success");
                }
            } finally {
                this.isLoadingEditProducts = false;
            }
        },

        resetPage() {
            this.page = 1;
            this.products.splice(0);
        },
    },
});
