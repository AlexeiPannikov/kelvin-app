import {ProductModel} from "../../api/models/responses/Products/ProductModel";
import {StyleGuide} from "../../api/models/responses/StyleGuides/StyleGuide";
import {PropertyModel} from "../../api/models/responses/Properties/PropertyModel";

export class ConfirmedProduct {
    product = new ProductModel()
    properties = new Array<PropertyModel>()
    styleGuide = new StyleGuide()
    sampleCode = ""

    get defaultProperties() {
        return this.properties.filter(({is_default}) => is_default)
    }

    get customProperties() {
        return this.properties.filter(({is_default}) => !is_default)
    }

    constructor(obj?: Partial<ConfirmedProduct>) {
        if (obj)
            Object.assign(this, obj)
    }
}