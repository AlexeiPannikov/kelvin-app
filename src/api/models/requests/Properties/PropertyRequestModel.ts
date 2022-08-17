export class PropertyRequestModel {
  property_id: number = null;
  value: string | number = "";

  constructor(property_id: number, value: string | number) {
    this.property_id = property_id;
    this.value = value;
  }
}
