import {PropertyModel} from "../api/models/responses/Properties/PropertyModel";
import {SampleModel} from "../api/models/responses/Samples/SampleModel";
import {defineStore} from "pinia";
import {ProductModel} from "../api/models/responses/Products/ProductModel";
import {viewStyleGuide} from "./methods/StyleGuides";
import {getProduct, getProducts} from "./methods/Products";
import {search} from "./methods/Samples";
import {ProductFullData} from "./models/ProductFullData";
import {getProperties} from "./methods/Properties";
import {EntityEnum} from "../api/models/responses/Properties/EntityEnum";
import ProductsService from "../api/services/ProductsService";
import {EditProductRequest} from "../api/models/requests/Products/EditProductRequest";
import {PropertyRequestModel} from "../api/models/requests/Properties/PropertyRequestModel";
import Notifications from "../view/components/ui-notifications/models/Notifications";
import {useStudioStore} from "./StudioStore";
import {StyleGuide} from "../api/models/responses/StyleGuides/StyleGuide";

interface IParamsSavedProduct {
    productUuid: string,
    styleGuideUuid: string,
    sampleCode: string
}

export interface ISavedProduct {
    product: {
        code: string,
        uuid: string
    }
    styleGuide: {
        name: string,
        uuid: string,
        url: string
    }
    productionType: {
        name: string,
        uuid: string
    }
    sampleCode: string
}

export const useScanProductStore = defineStore("scan-product", {
    state: () => {
        return {
            isLoadingScan: false,
            isLoadingProduct: false,
            isLoadingEditProduct: false,
            samples: new Array<SampleModel>(),
            products: new Array<ProductModel>(),
            selectedJobCode: "",
            selectedSample: null,
            barcode: "",
            product: null as ProductFullData,
            confirmedProduct: null as ProductFullData,
            productCopy: null as ProductFullData,
            productsIsStore: JSON.parse(localStorage.getItem("products")) as ISavedProduct[] || new Array<ISavedProduct>()
        };
    },

    getters: {
        isChangedProduct(): boolean {
            return JSON.stringify(this.product) !== JSON.stringify(this.productCopy)
        },

        isHasSelectedProdType(): boolean {
            const studioStore = useStudioStore()
            return !!this.product?.styleGuide.shootingTypes.find(({production_type_uuid}) => studioStore.selectedProductionTypeUuid === production_type_uuid)
        }
    },

    actions: {
        async search(barcode?: string) {
            this.isLoadingScan = true;
            this.samples = await search({barcode: barcode || this.barcode})
            this.isLoadingScan = false;
        },

        async getProducts(free_text: string) {
            const [products] = await getProducts({free_text})
            this.products = products
        },

        async getProduct(uuid: string) {
            this.isLoadingProduct = true
            const product = await getProduct({uuid})
            const [properties] = await getProperties(EntityEnum.PRODUCT)
            this.product = new ProductFullData({
                product,
                properties: properties.map(item => new PropertyModel({
                    ...item,
                    value: this.product.product[item.internal_name as keyof ProductModel]?.toString() || ""
                }))
            })
            this.isLoadingProduct = false
        },

        async editProduct() {
            this.isLoadingEditProduct = true;
            const {properties, product} = this.product
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
                    this.copyProduct()
                    if (this.confirmedProduct)
                        this.confirmProduct()
                    Notifications.newMessage("Product edited successfully");
                } else this.resetProduct()
            } finally {
                this.isLoadingEditProduct = false;
            }
        },

        async getProductData(product_uuid?: string) {
            this.isLoadingProduct = true
            try {
                if (this.samples.length === 1) {
                    this.selectedSample = this.samples[0]
                    this.selectedJobCode = this.selectedSample.job_code
                }
                if (!this.selectedSample?.product_code) return
                let productInSelectedTask: ProductModel = null
                if (!product_uuid) {
                    await this.getProducts(this.selectedSample?.product_code)
                    if (!this.selectedJobCode) return
                    productInSelectedTask = this.products.find(({job_code}) => this.selectedJobCode === job_code) as ProductModel
                    if (!productInSelectedTask) return
                }
                const product = await getProduct({uuid: productInSelectedTask?.product_uuid || product_uuid})
                const [properties] = await getProperties(EntityEnum.PRODUCT)
                const mappedProperties = properties.map(item => new PropertyModel({
                    ...item,
                    value: product[item.internal_name as keyof ProductModel]?.toString() || ""
                }))
                let styleGuide = new StyleGuide()
                if (product.styleguide_uuid) {
                    styleGuide = await viewStyleGuide({uuid: product.styleguide_uuid})
                }
                this.product = new ProductFullData({
                    product,
                    styleGuide,
                    properties: mappedProperties,
                    sampleCode: this.selectedSample.sample_code
                })
                this.copyProduct()
            } finally {
                this.isLoadingProduct = false
            }
        },

        async getProductFromSavedList({productUuid, styleGuideUuid, sampleCode}: IParamsSavedProduct) {
            this.isLoadingProduct = true
            const product = await getProduct({uuid: productUuid})
            const [properties] = await getProperties(EntityEnum.PRODUCT)
            const mappedProperties = properties.map(item => new PropertyModel({
                ...item,
                value: product[item.internal_name as keyof ProductModel]?.toString() || ""
            }))
            const styleGuide = await viewStyleGuide({uuid: styleGuideUuid})
            this.confirmedProduct = new ProductFullData({
                product,
                styleGuide,
                properties: mappedProperties,
                sampleCode
            })
            this.isLoadingProduct = false
        },

        confirmProduct() {
            this.confirmedProduct = new ProductFullData({
                product: this.product.product as ProductModel,
                styleGuide: this.product.styleGuide,
                sampleCode: this.product.sampleCode,
                properties: this.product.properties
            })
        },

        copyProduct() {
            this.productCopy = new ProductFullData({
                product: this.product.product,
                styleGuide: this.product.styleGuide,
                sampleCode: this.product.sampleCode,
                properties: this.product.properties
            })
        },

        resetProduct() {
            this.product = new ProductFullData({
                product: this.productCopy.product,
                styleGuide: this.productCopy.styleGuide,
                sampleCode: this.productCopy.sampleCode,
                properties: this.productCopy.properties
            })
        },

        initProductFromConfirmedProduct() {
            this.product = new ProductFullData({
                product: this.confirmedProduct.product,
                styleGuide: this.confirmedProduct.styleGuide,
                sampleCode: this.confirmedProduct.sampleCode,
                properties: this.confirmedProduct.properties
            })
        },

        resetData() {
            this.samples = new Array<SampleModel>()
            this.selectedJobCode = ""
            this.selectedSample = null
            this.barcode = ""
            this.product = null
            this.productCopy = null
        },

        saveInStorage() {
            localStorage.setItem("products", JSON.stringify(this.productsIsStore))
        },

        saveProduct() {
            const studioStore = useStudioStore()
            const {product, styleGuide, sampleCode} = this.confirmedProduct
            const {selectedProductionTypeUuid} = studioStore
            const productToSave: ISavedProduct = {
                product: {code: product.product_code, uuid: product.product_uuid},
                productionType: {
                    name: studioStore.productionTypes.find(({uuid}) => selectedProductionTypeUuid === uuid)?.name,
                    uuid: selectedProductionTypeUuid
                },
                styleGuide: {name: styleGuide.name, uuid: styleGuide.uuid, url: styleGuide.coverFile.url},
                sampleCode: sampleCode
            }
            if (!this.productsIsStore?.length) {
                this.productsIsStore.push(productToSave)
            }
            if (this.productsIsStore?.length) {
                const index = this.productsIsStore.findIndex(({product: {uuid}}) => product.product_uuid === uuid)
                index ? this.productsIsStore.splice(index, 1, productToSave) : this.productsIsStore.push(productToSave)
            }
            this.saveInStorage()
            this.confirmedProduct = null
        },
    },
});
