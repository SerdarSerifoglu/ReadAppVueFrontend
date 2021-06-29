import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "../router/index.js";
// import createPersistedState from "vuex-persistedstate";
import axiosNonTokenService from "../helpers/axiosHelperNonToken.js";
// import axiosService from "../helpers/axiosHelper.js";
// import axiosNonLoadingService from "../helpers/axiosHelperNonLoading.js";

Vue.use(Vuex);
export default new Vuex.Store({
  // plugins: [createPersistedState()],
  state: {
    token: "",
    userSettings: {
      _id: "",
      color: "",
      selectedPackId: "",
    },
    userData: {
      access_token: "",
    },
    isLoading: false,
  },
  mutations: {
    SET_USER_DATA(state, userData) {
      state.userData = userData;
      localStorage.setItem("user", JSON.stringify(userData));
      console.log({ tokenSerdar: state.userData.access_token });
      // axiosNonLoadingService.defaults.headers.common[
      //   "Authorization"
      // ] = `Bearer: ${state.userData.access_token}`;
      // axiosService.defaults.headers.common[
      //   "Authorization"
      // ] = `Bearer: ${state.userData.access_token}`;
    },
    CLEAR_USER_DATA(state) {
      state;
      localStorage.removeItem("user");
      location.reload();
    },
    setToken(state, token) {
      state.token = token;
    },
    clearToken(state) {
      state.token = "";
      router.push("/login");
    },
    // setUserSetting(state, data) {
    //   state.userSettings.color = data.wordColor;
    //   state.userSettings.selectedPackId = data.selectedPackId;
    //   state.userSettings._id = data._id;
    // },
    getUserSettings(state) {
      state.userSettings;
    },
    openLoading(state) {
      state.isLoading = true;
    },
    closeLoading(state) {
      state.isLoading = false;
    },
    // register(state, credentials) {
    //   console.log({ MutationRegister: credentials });
    // },
    setUserSettings(state) {
      console.log({ setUserSettingInStore: "serdar" });
      axios
        .get(`${process.env.VUE_APP_BASE_PATH}/userSetting/getUserSettings`, {
          headers: {
            Authorization: `Bearer: ${state.userData.access_token}`,
          },
        })
        .then(response => {
          // commit("setUserSetting", response.data.data);
          state.userSettings.color = response.data.data.wordColor;
          state.userSettings.selectedPackId = response.data.data.selectedPackId;
          state.userSettings._id = response.data.data._id;
          return response.data.data;
        })
        .catch(e => console.log(e));
    },
  },
  actions: {
    register({ commit }, credentials) {
      return axiosNonTokenService
        .post(`${process.env.VUE_APP_BASE_PATH}/auth/register`, credentials)
        .then(({ data }) => {
          console.log({ registerData: data });
          commit("SET_USER_DATA", data);
        });
    },
    login({ commit }, credentials) {
      return axiosNonTokenService
        .post(`${process.env.VUE_APP_BASE_PATH}/auth/login`, credentials)
        .then(({ data }) => {
          console.log({ registerData: data });
          commit("SET_USER_DATA", data);
          this.dispatch("setUserSettings", commit);
        });
    },
    openLoading({ commit }) {
      commit("openLoading");
    },
    closeLoading({ commit }) {
      commit("closeLoading");
    },
    logout({ commit }) {
      commit("CLEAR_USER_DATA");
    },
    clearToken({ commit }) {
      commit("clearToken");
    },
    setToken({ commit, payload }) {
      console.log(payload);
      commit("setToken", payload);
    },
    setUserSettings({ commit }) {
      console.log({ setUserSettingInStore: "serdar" });
      console.log(commit);
      axios
        .get(`${process.env.VUE_APP_BASE_PATH}/userSetting/getUserSettings`, {
          headers: {
            Authorization: `Bearer: ${this.state.userData.access_token}`,
          },
        })
        .then(response => {
          // commit("setUserSetting", response.data.data);
          this.state.userSettings.color = response.data.data.wordColor;
          this.state.userSettings.selectedPackId =
            response.data.data.selectedPackId;
          this.state.userSettings._id = response.data.data._id;
          return response.data.data;
        })
        .catch(e => console.log(e));
    },
  },
  getters: {
    getToken(state) {
      return state.userData.access_token;
    },
    isAuthenticated(state) {
      console.log("isAuthenticated Store: " + state.userData.access_token);
      return state.userData.access_token != "";
    },
    getUserSettings(state) {
      return state.userSettings;
    },
    getLoadingStatus(state) {
      return state.isLoading;
    },
    getStateToken(state) {
      return state.token;
    },
  },
  modules: {},
});
