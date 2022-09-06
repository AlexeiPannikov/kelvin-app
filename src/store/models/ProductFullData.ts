import {ProductModel} from "../../api/models/responses/Products/ProductModel";
import {StyleGuide} from "../../api/models/responses/StyleGuides/StyleGuide";
import {PropertyModel} from "../../api/models/responses/Properties/PropertyModel";
import {Position} from "../../api/models/requests/StyleGuides/Position";
import {ShootingType} from "../../api/models/requests/StyleGuides/ShootingType";
import {Task} from "../../api/models/responses/Products/Task";

export class ProductFullData {
    product = new ProductModel()
    properties = new Array<PropertyModel>()
    styleGuide = new StyleGuide()
    taskList = new Array<Task>()
    sampleCode = ""

    get defaultProperties() {
        return this.properties.filter(({is_default}) => is_default)
    }

    get customProperties() {
        return this.properties.filter(({is_default}) => !is_default)
    }

    constructor(obj?: Partial<ProductFullData>) {
        if (obj) {
            Object.assign(this, obj)
            this.styleGuide = new StyleGuide(obj.styleGuide)
            this.product = new ProductModel(obj.product)
            this.properties = obj.properties.map(item => new PropertyModel(item))
        }
    }
}