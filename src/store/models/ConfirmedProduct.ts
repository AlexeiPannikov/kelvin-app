import {ProductModel} from "../../api/models/responses/Products/ProductModel";
import {StyleGuide} from "../../api/models/responses/StyleGuides/StyleGuide";
import {PropertyModel} from "../../api/models/responses/Properties/PropertyModel";

export class ConfirmedProduct {
    product = new ProductModel()
    properties = new Array<PropertyModel>()
    styleGuide = new StyleGuide()
    sampleCode = ""

    constructor(product?: ProductModel, styleGuide?: StyleGuide, properties?: PropertyModel[], sampleCode?: string) {
        if (product)
            this.product = product
        if (styleGuide)
            this.styleGuide = styleGuide
        if (properties)
            this.properties = properties
        if (sampleCode)
            this.sampleCode = sampleCode
    }
}