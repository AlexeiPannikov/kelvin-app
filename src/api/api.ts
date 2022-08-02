import Cookies from "js-cookie";

import axios from "axios";
// import Notifications from "@components/ui-notifications/models/Notifications";

const $api = axios.create({
  // withCredentials: true,
  baseURL: import.meta.env.VITE_BASE_API_URL,
});

$api.interceptors.request.use((config) => {
  if (config.headers) {
    config.headers.Authorization = `Bearer ${Cookies.get("token")}`;
    return config;
  }
});

$api.interceptors.response.use(
  (config) => {
    console.log(config);
    return config;
  },
  async (error) => {
    console.log(error);
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
          { withCredentials: true }
        );
        Cookies.set("token", response.data.Value.accessToken);
        return $api.request(originalRequest);
      } catch (e) {
        console.log("Not authorized");
      }
    }
    console.log(error.response.data.message)
    // Notifications.newWarning(error.response.data.message);
  }
);

export default $api;
