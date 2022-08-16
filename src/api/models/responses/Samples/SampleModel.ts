import {SampleProduction} from "./SampleProduction";

export class SampleModel {
  job_id: number = null;
  product_id: number = null;
  sample_id: number = null;
  sample_uuid = "";
  client_id = "";
  deadline = "";
  job_code = "";
  job_name = "";
  brand = "";
  color = "";
  product_code = "";
  product_name = "";
  sample_code = "";
  size = "";
  client_name = "";
  checkin: number = null;
  barcode: string = null;
  container: string = null;
  category = "";
  gender = "";
  location = "";
  productions = new Array<SampleProduction>();

  constructor(obj?: Partial<SampleModel>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
