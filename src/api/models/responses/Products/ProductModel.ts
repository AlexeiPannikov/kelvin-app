import {ProductStatusEnum} from "../../requests/Products/ProductStatusEnum";
import {StyleGuide} from "../StyleGuides/StyleGuide";

export class ProductModel {
    job_id: number = null;
    product_id: number = null;
    product_code: string = null;
    product_uuid: string = "";
    client_id: number = null;
    job_code: string = null;
    product_name: string = null;
    checked = 0;
    checkin_percent: string = null;
    checkin_diff: string = null;
    brand: string = "";
    client_name: string = "";
    color: string = "";
    deadline: string = "";
    job_name: string = "";
    status: ProductStatusEnum = null;
    category: string = "";
    location: string = null;
    state: number = 0;
    styleguide_name: string = null
    styleguide_uuid: string = null
    styleGuide = new StyleGuide()

    constructor(obj?: Partial<ProductModel>) {
        if (obj) Object.assign(this, obj)
    }
}
