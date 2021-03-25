import axios from "axios";
import store from "../store/index.js";

const axiosNonLoadingService = axios.create();

axiosNonLoadingService.defaults.baseURL = process.env.VUE_APP_BASE_PATH;
axiosNonLoadingService.defaults.headers.common[
  "Authorization"
] = `Bearer: ${store.getters.getStateToken}`;

axiosNonLoadingService.interceptors.request.use(
  function(config) {
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);
axiosNonLoadingService.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error.response.status === 401) {
      store.dispatch("logout");
    }
    return Promise.reject(error);
  }
);

export default axiosNonLoadingService;
