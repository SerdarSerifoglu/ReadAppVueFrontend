import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "../router/index.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token") || "",
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    clearToken(state) {
      state.token = "";
      localStorage.setItem("token", "");
    },
  },
  actions: {
    async initAuth({ commit }) {
      let token = localStorage.getItem("token");
      console.log("Token:" + token);
      if (token != "") {
        await axios
          .get("http://localhost:5000/api/auth/tokentest", {
            headers: {
              Authorization: `Bearer: ${token}`,
            },
          })
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
            console.log(e);
          });
      } else {
        commit("clearToken");
        router.push("/login");
      }
    },
    login({ commit }, authData) {
      axios
        .post("http://localhost:5000/api/auth/login", { ...authData })
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
  },
  getters: {
    isAuthenticated(state) {
      console.log("isAuthenticated Store: " + state.token);
      return state.token != "";
    },
  },
  modules: {},
});
