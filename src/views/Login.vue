<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  margin-top: 30px;
  width: 500px;
  padding: 20px 40px;
  -webkit-box-shadow: 5px 6px 17px 0px rgba(0, 0, 0, 0.68);
  -moz-box-shadow: 5px 6px 17px 0px rgba(0, 0, 0, 0.68);
  box-shadow: 5px 6px 17px 0px rgba(0, 0, 0, 0.68);
  border-radius: 10px;
}
.logo1 {
  width: 400px;
  height: 100px;
  background-image: url("../assets/HardworderSWG.svg");
  background-repeat: no-repeat;
  background-position: center;
}
input[type="email"],
input[type="password"] {
  width: 80%;
  text-align: center;
  padding: 5px 20px;
  font-size: 15px;
  border: none;
  border-radius: 5px;
  margin: 10px 0px;
  border: 1px solid gray;
  transition: width 1s;
}
input[type="email"]:focus,
input[type="password"]:focus {
  border: 1px solid red;
  width: 100%;
  transition: width 1s;
}
.login-div button {
  padding: 8px 30px;
  margin-top: 10px;
  border-radius: 15px;
  background-color: white;
  border: none;
  font-size: 15px;
  color: red;
  border: 1px solid red;
  transition: 1s;
}
.login-div button:hover {
  background-color: red;
  color: white;
  transition: 1s;
}
.forgotPass {
  cursor: pointer;
}
@media only screen and (max-width: 768px) {
  .container {
    width: 100%;
    height: 100vh;
    justify-content: flex-start;
    margin-top: 0px;
    border-radius: 0;
  }
}
</style>
<template>
  <div class="login">
    <div class="container">
      <div class="logo1"></div>
      <input
        type="email"
        placeholder="Email"
        v-model="loginData.email"
        @keydown.enter="submit"
      />
      <input
        type="password"
        placeholder="Password"
        v-model="loginData.password"
        @keydown.enter="submit"
      />
      <div class="forgotPass" @click="goForgotPassword">Forgot my password</div>
      <div class="login-div">
        <button @click="login">LOGIN</button>
      </div>
      <p>{{ loginData.error }}</p>
    </div>
    <loading></loading>
  </div>
</template>

<script>
import router from "../router/index.js";
import axiosNonTokenService from "../helpers/axiosHelperNonToken.js";
import Loading from "../components/Loading.vue";
import { basicAlertSwal } from "../helpers/alertHelper.js";
import store from "../store/index";

export default {
  data() {
    return {
      loginData: {
        email: "",
        password: "",
        error: null,
      },
      tokenNow: "",
    };
  },
  name: "Login",
  components: {
    loading: Loading,
  },
  methods: {
    login() {
      this.$store
        .dispatch("login", {
          email: this.loginData.email,
          password: this.loginData.password,
        })
        .then(() => {
          this.$router.push({ name: "Reader" });
        })
        .catch((err) => {
          this.loginData.error = err.response.data.message;
        });
    },
    submit() {
      axiosNonTokenService
        .post("/auth/login", { ...this.loginData })
        .then((response) => {
          store.commit("setToken", response.data.access_token);
          router.push("/reader");
        })
        .catch((e) => {
          if (e.response.data.success === false) {
            basicAlertSwal(e.response.data.message, "error");
          }
        });
    },
    readToken() {
      this.tokenNow = store.state.token;
    },
    goForgotPassword: function () {
      router.push("/forgotpassword");
    },
  },
  beforeCreate: function () {
    localStorage.removeItem("vuex");
  },
};
</script>
