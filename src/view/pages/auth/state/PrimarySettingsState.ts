import {reactive} from "vue";
import {PrimarySettings} from "../models/PrimarySettings";

export const primarySettings = reactive(<PrimarySettings>{
    folder: "",
    transferHistory: 7,
    adobeApplications: {
        ps: "",
        br: ""
    }
})