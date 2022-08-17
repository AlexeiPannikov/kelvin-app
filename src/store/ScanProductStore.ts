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
            isLoadingStyleGuide: false,
            samples: new Array<SampleModel>(),
            products: new Array<ProductModel>(),
            product: new ProductModel(),
            productProperties: new Array<PropertyModel>(),
            selectedJobCode: "",
            selectedSample: null,
            styleGuide: new StyleGuide(),
            barcode: "",
            confirmedProduct: null as ConfirmedProduct
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
            if (!this.product) return []
            return this.confirmedProduct.properties.map(prop => {
                    return {
                        internal_name: prop.internal_name,
                        name: prop.name,
                        value: this.confirmedProduct.product[prop.internal_name as keyof ProductModel]
                    }
                }
            ).filter(item => item.value);
        },
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
            if (this.product.styleguide_uuid) {
                await this.viewStyleGuide(this.product.styleguide_uuid)
            }
        },

        async getProductFromSavedList({productUuid, styleGuideUuid, sampleCode}: IParamsSavedProduct) {
            const product = await getProduct({uuid: productUuid})
            const [properties] = await getProperties(EntityEnum.PRODUCT)
            const styleGuide = await viewStyleGuide({uuid: styleGuideUuid})
            this.confirmedProduct = new ConfirmedProduct(product, styleGuide, properties, sampleCode)
        },

        confirmProduct() {
            this.confirmedProduct = new ConfirmedProduct(this.product, this.styleGuide, this.productProperties, this.selectedSample.sample_code)
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
