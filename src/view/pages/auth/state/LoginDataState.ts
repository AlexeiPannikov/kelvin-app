import {reactive} from "vue";
import {LoginRequest} from "../../../../api/models/requests/Auth/LoginRequest";

export const loginData = reactive(new LoginRequest())