import axios from "axios";
import store from "../store/index.js";

const axiosNonTokenService = axios.create();

axiosNonTokenService.defaults.baseURL = process.env.VUE_APP_BASE_PATH;

axiosNonTokenService.interceptors.request.use(
  function(config) {
    store.dispatch("openLoading");
    return config;
  },
  function(error) {
    store.dispatch("closeLoading");
    return Promise.reject(error);
  }
);
axiosNonTokenService.interceptors.response.use(
  function(response) {
    store.dispatch("closeLoading");
    console.log({ "response Serdar RESPONSE:NONTOKEN": response.status });
    return response;
  },
  function(error) {
    store.dispatch("closeLoading");
    return Promise.reject(error);
  }
);

export default axiosNonTokenService;
