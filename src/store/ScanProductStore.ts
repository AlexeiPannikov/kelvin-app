import {PropertyModel} from "../api/models/responses/Properties/PropertyModel";
import {SampleModel} from "../api/models/responses/Samples/SampleModel";
import {defineStore} from "pinia";
import {ProductModel} from "../api/models/responses/Products/ProductModel";
import {StyleGuide} from "../api/models/responses/StyleGuides/StyleGuide";
import {viewStyleGuide} from "./methods/StyleGuides";
import {getProduct, getProducts} from "./methods/Products";
import {search} from "./methods/Samples";
import {ConfirmedProduct} from "./models/ConfirmedProduct";
import {getProperties} from "./methods/Properties";
import {EntityEnum} from "../api/models/responses/Properties/EntityEnum";
import ProductsService from "../api/services/ProductsService";
import {EditProductRequest} from "../api/models/requests/Products/EditProductRequest";
import {PropertyRequestModel} from "../api/models/requests/Properties/PropertyRequestModel";
import Notifications from "../view/components/ui-notifications/models/Notifications";

interface IParamsSavedProduct {
    productUuid: string,
    styleGuideUuid: string,
    sampleCode: string
}

export const useScanProductStore = defineStore("scan-product", {
    state: () => {
        return {
            isLoadingScan: false,
            isLoadingProducts: false,
            isLoadingProduct: false,
            isLoadingEditProduct: false,
            isLoadingStyleGuide: false,
            samples: new Array<SampleModel>(),
            products: new Array<ProductModel>(),
            product: new ProductModel(),
            productProperties: new Array<PropertyModel>(),
            selectedJobCode: "",
            selectedSample: null,
            styleGuide: new StyleGuide(),
            barcode: "",
            confirmedProduct: null as ConfirmedProduct,
            confirmedProductCopy: null as ConfirmedProduct
        };
    },

    getters: {
        productPropertiesList(): { internal_name: string, name: string, value: any }[] {
            if (!this.product) return []
            return this.productProperties.map(prop => {
                    return {
                        internal_name: prop.internal_name,
                        name: prop.name,
                        value: this.product[prop.internal_name as keyof ProductModel]
                    }
                }
            ).filter(item => item.value);
        },

        confirmedProductPropertiesList(): { internal_name: string, name: string, value: any }[] {
            if (!this.confirmedProduct) return []
            return this.confirmedProduct.properties.map(prop => {
                    return {
                        internal_name: prop.internal_name,
                        name: prop.name,
                        value: this.confirmedProduct.product[prop.internal_name as keyof ProductModel]
                    }
                }
            ).filter(item => item.value);
        },

        isChangedConfirmedProduct(): boolean {
            return JSON.stringify(this.confirmedProduct) !== JSON.stringify(this.confirmedProductCopy)
        }
    },

    actions: {
        async search(barcode?: string) {
            this.isLoadingScan = true;
            this.samples = await search({barcode: barcode || this.barcode})
            this.isLoadingScan = false;
        },

        async getProducts(free_text: string) {
            this.isLoadingProducts = true;
            const [products, properties] = await getProducts({free_text})
            this.products = products
            this.productProperties = properties
            this.isLoadingProducts = false;
        },

        async getProduct(uuid: string) {
            this.isLoadingProduct = true;
            this.product = await getProduct({uuid})
            this.isLoadingProduct = false;
        },

        async editConfirmedProduct() {
            this.isLoadingEditProduct = true;
            const {properties, product} = this.confirmedProduct
            console.log(properties)
            try {
                const res = await ProductsService.editProduct(
                    product.product_uuid,
                    new EditProductRequest({
                        is_active: !!product.state,
                        status: product.status,
                        styleguide_uuid: product.styleguide_uuid,
                        properties: [
                            ...properties.map(
                                ({propertyId, valueDependingOfType}) =>
                                    new PropertyRequestModel(
                                        propertyId,
                                        valueDependingOfType?.toString() || ""
                                    )
                            ),
                        ],
                    })
                );
                if (res) {
                    this.copyConfirmedProduct()
                    Notifications.newMessage("Product edited successfully");
                } else this.resetConfirmedProduct()
            } finally {
                this.isLoadingEditProduct = false;
            }
        },

        async viewStyleGuide(uuid: string) {
            this.isLoadingStyleGuide = true
            this.styleGuide = await viewStyleGuide({uuid})
            this.isLoadingStyleGuide = false
        },

        async getSelectedProductData() {
            if (this.samples.length === 1) {
                this.selectedSample = this.samples[0]
                this.selectedJobCode = this.selectedSample.job_code
            }
            if (!this.selectedSample?.product_code) return
            await this.getProducts(this.selectedSample?.product_code)
            if (!this.selectedJobCode) return
            const productInSelectedTask = this.products.find(({job_code}) => this.selectedJobCode === job_code)
            if (!productInSelectedTask) return
            await this.getProduct(productInSelectedTask.product_uuid)
            this.productProperties = this.productProperties.map(item => new PropertyModel({
                ...item,
                value: this.product[item.internal_name as keyof ProductModel]?.toString() || ""
            }))
            if (this.product.styleguide_uuid) {
                await this.viewStyleGuide(this.product.styleguide_uuid)
            }
        },

        async getProductFromSavedList({productUuid, styleGuideUuid, sampleCode}: IParamsSavedProduct) {
            const product = await getProduct({uuid: productUuid})
            const [properties] = await getProperties(EntityEnum.PRODUCT)
            const mappedProperties = properties.map(item => new PropertyModel({
                ...item,
                value: product[item.internal_name as keyof ProductModel]?.toString() || ""
            }))
            const styleGuide = await viewStyleGuide({uuid: styleGuideUuid})
            this.confirmedProduct = new ConfirmedProduct({
                product,
                styleGuide,
                properties: mappedProperties,
                sampleCode
            })
            this.copyConfirmedProduct()
        },

        confirmProduct() {
            this.confirmedProduct = new ConfirmedProduct({
                product: this.product,
                styleGuide: this.styleGuide,
                properties: this.productProperties,
                sampleCode: this.selectedSample.sample_code
            })
            this.copyConfirmedProduct()
        },

        copyConfirmedProduct() {
            this.confirmedProductCopy = new ConfirmedProduct(JSON.parse(JSON.stringify(this.confirmedProduct)))
        },

        resetConfirmedProduct() {
            this.confirmedProduct = new ConfirmedProduct(JSON.parse(JSON.stringify(this.confirmedProductCopy)))
        },

        resetData() {
            this.samples = new Array<SampleModel>()
            this.products = new Array<ProductModel>()
            this.product = new ProductModel()
            this.productProperties = new Array<PropertyModel>()
            this.selectedJobCode = ""
            this.selectedSample = null
            this.styleGuide = new StyleGuide()
            this.barcode = ""
        }
    },
});
