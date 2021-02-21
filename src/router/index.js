import Vue from "vue";
import VueRouter from "vue-router";
import Register from "../views/Register.vue";
import Reader from "../views/Reader.vue";
import PackAdd from "../views/pack/Add.vue";
import Login from "../views/Login.vue";
import Word from "../views/word/Add.vue";
import SharedPacks from "../views/pack/SharedPacks.vue";
import UserSettings from "../views/user/UserSettings.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import ResetPassword from "../views/ResetPassword.vue";
// import PackWord from "../views/PackWord.vue";

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
    path: "/forgotPassword",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/resetPassword",
    name: "ResetPassword",
    component: ResetPassword,
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
        next();
      }
    },
  },
  {
    path: "/pack",
    name: "PackAdd",
    component: PackAdd,
    children: [{ path: "", component: PackAdd }],
    async beforeEnter(to, from, next) {
      if (store.getters.isAuthenticated) {
        next();
      } else {
        await store.dispatch("initAuth");
        next();
      }
    },
  },
  {
    path: "/words",
    name: "Word",
    component: Word,
    async beforeEnter(to, from, next) {
      if (store.getters.isAuthenticated) {
        next();
      } else {
        await store.dispatch("initAuth");
        next();
      }
    },
  },
  // {
  //   path: "/packword",
  //   name: "PackWord",
  //   component: PackWord,
  //   async beforeEnter(to, from, next) {
  //     if (store.getters.isAuthenticated) {
  //       next();
  //     } else {
  //       await store.dispatch("initAuth");
  //       next();
  //     }
  //   },
  // },
  {
    path: "/sharedPacks",
    name: "SharedPacks",
    component: SharedPacks,
    async beforeEnter(to, from, next) {
      if (store.getters.isAuthenticated) {
        next();
      } else {
        await store.dispatch("initAuth");
        next();
      }
    },
  },
  {
    path: "/userSettings",
    name: "UserSettings",
    component: UserSettings,
    async beforeEnter(to, from, next) {
      if (store.getters.isAuthenticated) {
        next();
      } else {
        await store.dispatch("initAuth");
        next();
      }
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
