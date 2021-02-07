import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "../router/index.js";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);
axios.defaults.baseURL = process.env.VUE_APP_BASE_PATH;
if (localStorage.getItem("token")) {
  axios.defaults.headers.common["Authorization"] = `Bearer: ${localStorage.getItem("token")}`;
}
export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    token: localStorage.getItem("token") || "",
    userSettings: {
      _id: "",
      color: "",
      selectedPackId: "",
    },
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    clearToken(state) {
      state.token = "";
      localStorage.setItem("token", "");
      router.push("/login");
    },
    setSelectedPack(state, data) {
      state.userSettings.color = data.wordColor;
      state.userSettings.selectedPackId = data.selectedPackId;
      state.userSettings._id = data._id;
    },
    getUserSettings(state) {
      state.userSettings;
    },
  },
  actions: {
    async initAuth({ commit }) {
      let token = localStorage.getItem("token");
      console.log("Token:" + token);
      if (token != "") {
        await axios
          .get("/auth/tokentest")
          .then((response) => {
            console.log(response.data);
            if (response.data.success === false) {
              commit("clearToken");
              router.push("/login");
            } else {
              commit("setToken", token);
            }
          })
          .catch((e) => {
            router.push("/login");
            console.log(e);
          });
      } else {
        commit("clearToken");
        router.push("/login");
      }
    },
    login({ commit }, authData) {
      axios
        .post("/auth/login", { ...authData })
        .then((response) => {
          commit("setToken", response.data.access_token);
          router.push("/reader");
        })
        .catch((e) => console.log(e));
    },
    logout({ commit }) {
      commit("clearToken");
      router.push({ name: "Login" });
      // router.push("/login");
    },
    clearToken({ commit }) {
      commit("clearToken");
    },
    setUserSettings({ commit }) {
      axios
        .get("/userSetting/getUserSettings")
        .then((response) => {
          commit("setSelectedPack", response.data.data);
        })
        .catch((e) => console.log(e));
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
  },
  modules: {},
});
