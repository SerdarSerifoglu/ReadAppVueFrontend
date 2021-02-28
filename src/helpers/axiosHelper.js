import axios from "axios";
import store from "../store/index.js";
import { basicAlertSwal } from "../helpers/alertHelper.js";

const axiosService = axios.create();

axiosService.defaults.baseURL = process.env.VUE_APP_BASE_PATH;
axiosService.defaults.headers.common[
  "Authorization"
] = `Bearer: ${store.getters.getStateToken}`;

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
    return response;
  },
  function(error) {
    store.dispatch("closeLoading");
    if (error.response.status == 401) {
      basicAlertSwal("Created a problem", "error");
      store.dispatch("logout");
    }
    return Promise.reject(error);
  }
);

export default axiosService;
