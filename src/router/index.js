import Vue from "vue";
import VueRouter from "vue-router";
import Register from "../views/Register.vue";
import Reader from "../views/Reader.vue";
import PackAdd from "../views/pack/Add.vue";
import Login from "../views/Login.vue";
import Test from "../views/word/Add.vue";
import SharedPacks from "../views/pack/SharedPacks.vue";
import UserSettings from "../views/user/UserSettings.vue";
import store from "../store/index.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/reader",
    name: "Reader",
    component: Reader,
    //herhangi bir router'a girmeden önce yapacağı işlem
    async beforeEnter(to, from, next) {
      if (store.getters.isAuthenticated) {
        next();
      } else {
        await store.dispatch("initAuth");
        console.log("attı router");
        next();
      }
    },
  },
  {
    path: "/pack",
    name: "PackAdd",
    component: PackAdd,
    children: [{ path: "", component: PackAdd }],
  },
  {
    path: "/test",
    name: "Test",
    component: Test,
  },
  {
    path: "/sharedPacks",
    name: "SharedPacks",
    component: SharedPacks,
  },
  {
    path: "/userSettings",
    name: "UserSettings",
    component: UserSettings,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
