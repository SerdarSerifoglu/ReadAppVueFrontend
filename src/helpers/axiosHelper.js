import axios from "axios";
import store from "../store/index.js";

const axiosService = axios.create();

axiosService.defaults.baseURL = process.env.VUE_APP_BASE_PATH;
axiosService.defaults.headers.common[
  "Authorization"
] = `Bearer: ${store.state.token}`;

axiosService.interceptors.request.use(
  function(config) {
    store.dispatch("openLoading");
    return config;
  },
  function(error) {
    store.dispatch("closeLoading");
    return Promise.reject(error);
  }
);
axiosService.interceptors.response.use(
  function(response) {
    store.dispatch("closeLoading");
    console.log({ "response Serdar RESPONSE:": response.status });
    return response;
  },
  function(error) {
    store.dispatch("closeLoading");
    return Promise.reject(error);
  }
);

export default axiosService;
