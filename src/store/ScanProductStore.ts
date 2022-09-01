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
import {ImageModel} from "../view/pages/capture/components/files-view/ImageModel";
import {useUserSettingsStore} from "./UserSettingsStore";
import moment from "moment";
import fs from "fs";
import {useTransferStore} from "./TransferStore";

interface IParamsSavedProduct {
    productUuid: string,
    styleGuideUuid: string,
    sampleCode: string,
}

export interface IPositionImagesStorageData {
    [key: string]: { images: ImageModel[], altImages: ImageModel[] }
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
        uuid: string,
        taskUuid: string
    }
    sampleCode: string,
    photosToTransfer: IPositionImagesStorageData,
    date: string
}

export const useScanProductStore = defineStore("scan-product", {
    state: () => {
        return {
            isLoadingScan: false,
            isLoadingProduct: false,
            isLoadingEditProduct: false,
            isLoadingConfirmProduct: false,
            samples: new Array<SampleModel>(),
            products: new Array<ProductModel>(),
            selectedJobCode: "",
            selectedSample: null,
            barcode: "",
            product: null as ProductFullData,
            confirmedProduct: null as ProductFullData,
            productCopy: null as ProductFullData,
            productsInStore: JSON.parse(localStorage.getItem("products")) as ISavedProduct[] || new Array<ISavedProduct>()
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
            const studioStore = useStudioStore()
            const foundedProduct = this.productsInStore.find(item => item.product.code === (barcode || this.barcode) && studioStore.selectedProductionTypeUuid === item.productionType.uuid)
            if (foundedProduct) {
                await this.getProductFromSavedList(foundedProduct.product.uuid, foundedProduct.productionType.uuid)
                return
            }
            try {
                this.samples = await search({barcode: barcode || this.barcode})
            } finally {
                this.isLoadingScan = false;
            }
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

        async getProductFromSavedList(productUuid: string, prodTypeUuid: string) {
            this.isLoadingProduct = true
            try {
                const foundedProduct = this.productsInStore.find(item => item.product.uuid === productUuid && item.productionType.uuid === prodTypeUuid)
                if (!foundedProduct) return
                const studioStore = useStudioStore()
                studioStore.selectedProductionTypeUuid = foundedProduct.productionType.uuid
                const product = await getProduct({uuid: productUuid})
                const [properties] = await getProperties(EntityEnum.PRODUCT)
                const mappedProperties = properties.map(item => new PropertyModel({
                    ...item,
                    value: product[item.internal_name as keyof ProductModel]?.toString() || ""
                }))
                const styleGuide = await viewStyleGuide({uuid: foundedProduct.styleGuide.uuid})
                const selectedShootingType = styleGuide.shootingTypes.find(({production_type_uuid}) => production_type_uuid === studioStore.selectedProductionTypeUuid)
                selectedShootingType?.positions?.forEach(position => {
                    position.images.list = foundedProduct.photosToTransfer[position.id]?.images.filter(({path}) => fs.existsSync(path)).map(item => new ImageModel(item)) || []
                    position.altsImages.list = foundedProduct.photosToTransfer[position.id]?.altImages.filter(({path}) => fs.existsSync(path)).map(item => new ImageModel(item)) || []
                })
                this.confirmedProduct = new ProductFullData({
                    product,
                    styleGuide,
                    properties: mappedProperties,
                    sampleCode: foundedProduct.sampleCode
                })
                this.saveProduct(false)
            } finally {
                this.isLoadingProduct = false
            }
        },

        async confirmProduct() {
            this.isLoadingConfirmProduct = true
            try {
                const res = await ProductsService.confirmProduct(this.product.product.product_uuid)
                if (res) {
                    res.forEach(item => {
                        const foundedShootingType = this.product.styleGuide.shootingTypes.find(shootingType => shootingType.production_type_uuid === item.production_type.uuid)
                        if (foundedShootingType)
                            foundedShootingType.taskUuid = item.task_uuid
                    })
                    this.confirmedProduct = new ProductFullData({
                        product: this.product.product as ProductModel,
                        styleGuide: this.product.styleGuide as StyleGuide,
                        sampleCode: this.product.sampleCode,
                        properties: this.product.properties,
                    })
                }
                Notifications.newMessage("Confirmed successfully")
                return true
            } finally {
                this.isLoadingConfirmProduct = false
            }
        },

        copyProduct() {
            this.productCopy = new ProductFullData({
                product: this.product.product as ProductModel,
                styleGuide: this.product.styleGuide as StyleGuide,
                sampleCode: this.product.sampleCode,
                properties: this.product.properties
            })
        },

        resetProduct() {
            this.product = new ProductFullData({
                product: this.productCopy.product as ProductModel,
                styleGuide: this.productCopy.styleGuide as StyleGuide,
                sampleCode: this.productCopy.sampleCode,
                properties: this.productCopy.properties
            })
        },

        initProductFromConfirmedProduct() {
            this.product = new ProductFullData({
                product: this.confirmedProduct.product as ProductModel,
                styleGuide: this.confirmedProduct.styleGuide as StyleGuide,
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
            localStorage.setItem("products", JSON.stringify(this.productsInStore))
        },

        saveProduct(resetConfirmedProduct = true) {
            const studioStore = useStudioStore()
            const {product, styleGuide, sampleCode} = this.confirmedProduct
            const {selectedProductionTypeUuid} = studioStore
            const selectedShootingType = styleGuide.shootingTypes.find(item => item.production_type_uuid === selectedProductionTypeUuid)
            const photosToTransfer: IPositionImagesStorageData = {}
            selectedShootingType?.positions?.forEach(({images, altsImages, id}) => {
                photosToTransfer[id] = {
                    images: images.list,
                    altImages: altsImages.list
                }
            })
            const productToSave: ISavedProduct = {
                product: {code: product.product_code, uuid: product.product_uuid},
                productionType: {
                    name: studioStore.productionTypes.find(({uuid}) => selectedProductionTypeUuid === uuid)?.name,
                    uuid: selectedProductionTypeUuid,
                    taskUuid: styleGuide.shootingTypes.find(({production_type_uuid}) => production_type_uuid === selectedProductionTypeUuid)?.taskUuid
                },
                styleGuide: {name: styleGuide.name, uuid: styleGuide.uuid, url: styleGuide.coverFile.url},
                sampleCode: sampleCode,
                photosToTransfer,
                date: moment().format()
            }
            if (!this.productsInStore?.length) {
                this.productsInStore.push(productToSave)
            }
            if (this.productsInStore?.length) {
                const index = this.productsInStore.findIndex(({
                                                                  product: {uuid},
                                                                  productionType
                                                              }) => product.product_uuid === uuid && productionType.uuid === selectedProductionTypeUuid)
                index > -1 ? this.productsInStore.splice(index, 1, productToSave) : this.productsInStore.push(productToSave)
            }
            this.saveInStorage()
            if (resetConfirmedProduct)
                this.confirmedProduct = null
        },

        deleteProduct(productUuid: string, prodTypeUuid: string) {
            const index = this.productsInStore.findIndex(({
                                                              product,
                                                              productionType
                                                          }) => product.uuid === productUuid && productionType.uuid === prodTypeUuid)
            this.productsInStore.splice(index, 1)
            this.saveInStorage()
        },

        checkOldProductsInStore() {
            const oldSelectedProductsFilter = ({date}: ISavedProduct) => {
                const {primarySettings} = useUserSettingsStore()
                const {selectionsForTransferHistory: maxTerm} = primarySettings
                let maxDate = moment()
                const iterations = maxTerm / 7
                const remainder = maxTerm % 7
                for (let i = 1; i <= iterations; i++) {
                    maxDate = maxDate.subtract(7, "d")
                }
                maxDate.subtract(remainder, "d")
                return !moment(date).isBefore(maxDate, "d")
            }
            this.productsInStore = this.productsInStore.filter(oldSelectedProductsFilter)
            this.saveInStorage()
        }
    },
});
