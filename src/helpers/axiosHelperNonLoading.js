import axios from "axios";
import store from "../store/index.js";

const axiosNonLoadingService = axios.create();

axiosNonLoadingService.defaults.baseURL = process.env.VUE_APP_BASE_PATH;
axiosNonLoadingService.defaults.headers.common[
  "Authorization"
] = `Bearer: ${store.state.token}`;

axiosNonLoadingService.interceptors.request.use(
  function(config) {
    // store.dispatch("openLoading");
    console.log({ "response Serdar REQUEST NONLOADING": "" });

    return config;
  },
  function(error) {
    // store.dispatch("closeLoading");
    return Promise.reject(error);
  }
);
axiosNonLoadingService.interceptors.response.use(
  function(response) {
    console.log({ "response Serdar RESPONSE:NONLOADING": response.status });
    return response;
  },
  function(error) {
    return Promise.reject(error);
  }
);

export default axiosNonLoadingService;
