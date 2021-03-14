import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "../router/index.js";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);
export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    token: "",
    userSettings: {
      _id: "",
      color: "",
      selectedPackId: "",
    },
    isLoading: false,
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    clearToken(state) {
      state;
      router.push("/login");
    },
    setUserSetting(state, data) {
      state.userSettings.color = data.wordColor;
      state.userSettings.selectedPackId = data.selectedPackId;
      state.userSettings._id = data._id;
    },
    getUserSettings(state) {
      state.userSettings;
    },
    openLoading(state) {
      state.isLoading = true;
    },
    closeLoading(state) {
      state.isLoading = false;
    },
  },
  actions: {
    openLoading({ commit }) {
      commit("openLoading");
    },
    closeLoading({ commit }) {
      commit("closeLoading");
    },
    logout({ commit }) {
      commit("clearToken");
    },
    clearToken({ commit }) {
      commit("clearToken");
    },
    setToken({ commit, payload }) {
      console.log(payload);
      commit("setToken", payload);
    },
    setUserSettings({ commit }) {
      axios
        .get(`${process.env.VUE_APP_BASE_PATH}/userSetting/getUserSettings`, {
          headers: {
            Authorization: `Bearer: ${this.state.token}`,
          },
        })
        .then(response => {
          commit("setUserSetting", response.data.data);
        })
        .catch(e => console.log(e));
    },
  },
  getters: {
    isAuthenticated(state) {
      console.log("isAuthenticated Store: " + state.token);
      return state.token != "";
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
