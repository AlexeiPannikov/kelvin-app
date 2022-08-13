import {EntityEnum} from "./EntityEnum";

export class EntityModel {
    id: number = null;
    entity_key: string = "";
    name: string = "";
    color: string = "primary"

    constructor(obj?: Partial<EntityModel>) {
        if (obj) {
            Object.assign(this, obj)
        }
        switch (this.id) {
            case EntityEnum.JOB:
                this.color = "blue"
                break
            case EntityEnum.SAMPLE:
                this.color = "green"
                break
            case EntityEnum.PRODUCT:
                this.color = "red"
                break
            case EntityEnum.STYLEGUIDE:
                this.color = "yellow"
            case EntityEnum.USER:
                this.color = "cyan"
                break
            case EntityEnum.LOCATION:
                this.color = "pink"
                break
        }
    }
}
