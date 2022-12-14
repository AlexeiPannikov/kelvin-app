import axios from "axios";
import Notifications from "../view/components/ui-notifications/models/Notifications";
import {useRouter} from "vue-router";

const $api = axios.create({
    // withCredentials: true,
    baseURL: import.meta.env.VITE_BASE_API_URL,
});

$api.interceptors.request.use((config) => {
    if (config.headers) {
        config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
        return config;
    }
});

$api.interceptors.response.use(
    (config) => {
        console.log(config);
        return config;
    },
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response.status === 401 &&
            error.config &&
            !error.config._isRetry
        ) {
            originalRequest._isRetry = true;
            try {
                const response = await axios.post<any>(
                    `${import.meta.env.VITE_BASE_API_URL}auth/refresh`,
                    {withCredentials: true}
                );
                localStorage.setItem("token", `${response.data.Value.accessToken}`);
                return $api.request(originalRequest);
            } catch (e) {
                document.dispatchEvent(new CustomEvent("not-authorized"));
                console.log("Not authorized");
            }
        }
        if (error.response.status !== 401) {
            Notifications.newMessage(error.response.data.message);
        }
    }
);

export default $api;
