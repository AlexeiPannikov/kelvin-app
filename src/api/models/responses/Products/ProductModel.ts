import {ProductStatusEnum} from "@api/models/requests/Products/ProductStatusEnum";

export class ProductModel {
    job_id: number = null;
    product_id: number = null;
    product_code: string = null;
    product_uuid: string = "";
    client_id: number = null;
    job_code: number = null;
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
}
