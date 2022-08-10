import {ProductionTypeCategoryEnum} from "./ProductionTypeCategoryEnum";

export class ProductionType {
  id: number = null;
  name: string = null;
  type = ProductionTypeCategoryEnum.CATEGORY_MODEL;
  uuid: string = null;
  is_system: number = null;
  is_enabled: number = null;
  isSelected = false;
  isLoadingToggleEnable = false;

  get hasRequireData() {
    return !!(this.name && this.type);
  }

  constructor(obj?: Partial<ProductionType>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
