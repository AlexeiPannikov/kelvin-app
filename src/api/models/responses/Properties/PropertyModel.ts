import {Option} from "../../requests/Properties/Option";
import moment from "moment"

export class PropertyModel {
    id: number = null;
    property_id: number = null;
    entity_id: number = null;
    type: string = "";
    name: string = "";
    value: string | number = "";
    internal_name: string = "";
    is_default: number = 0;
    options: Option[] = null;
    created_at: string = "";
    updated_at: string = "";
    isSelected = false

    get optionsSelectList() {
        if (!this.options?.length) return []
        const list = this.options.map(({option}) => ({title: option, value: option}))
        list.unshift({title: "", value: ""})
        return list
    }

    get formatData() {
        if (this.type === "data") {
            return moment(this.value).format("MM/DD/YYYY");
        }
    }

    get propertyId() {
        return this.id || this.property_id;
    }

    get valueDependingOfType() {
        if (this.type === "date") {
            return moment(this.value).format("MM/DD/YYYY");
        }
        if (this.type === "text" || this.type === "list") {
            return this.value;
        }
    }

    constructor(obj?: Partial<PropertyModel>) {
        if (obj) {
            Object.assign(this, obj);
        }
    }
}
