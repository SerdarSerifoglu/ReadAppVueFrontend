import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "../router/index.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: "",
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
    initAuth({ commit }) {
      let token = localStorage.getItem("token");
      console.log("Token:" + token);
      if (token != "") {
        commit("setToken", token);
      } else {
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
      return state.token != "";
    },
  },
  modules: {},
});
