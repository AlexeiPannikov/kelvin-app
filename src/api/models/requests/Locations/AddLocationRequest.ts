export class AddLocationRequest {
  type_id: number = null;
  country_id: number = null;
  name: string = "";
  code: string = "";
  address: string = "";
  city: string = "";
  zip: string = "";
  is_addaddress: boolean = false;
  is_enabled: boolean = false;
  is_checkin: boolean = false;

  constructor(obj?: Partial<AddLocationRequest>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
