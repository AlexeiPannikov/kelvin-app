export class PropertyRequestModel {
  property_id: number = null;
  value: string = "";

  constructor(property_id: number, value: string) {
    this.property_id = property_id;
    this.value = value;
  }
}
