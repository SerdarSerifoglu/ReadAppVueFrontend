<template>
  <div class="register">
    <div class="container">
      <label>Name</label>
      <input
        type="text"
        placeholder="Name Surname"
        v-model="registerData.name"
      />
      <label>Email</label>
      <input type="email" placeholder="Email" v-model="registerData.email" />
      <label>Password</label>
      <input
        type="password"
        placeholder="Password"
        v-model="registerData.password"
      />

      <div class="login-div">
        <button @click="register">REGISTER</button>
      </div>
    </div>
    <loading></loading>
  </div>
</template>

<script>
import axiosNonTokenService from "../helpers/axiosHelperNonToken.js";
import { basicAlertSwal } from "../helpers/alertHelper.js";
import Loading from "../components/Loading.vue";

export default {
  data() {
    return {
      registerData: {
        name: "",
        email: "",
        password: "",
      },
      tokenNow: "",
    };
  },
  name: "Register",
  components: {
    loading: Loading,
  },
  methods: {
    register() {
      this.$store.dispatch("register", { ...this.registerData }).then(() => {
        this.$router.push({ name: "Reader" });
      });
      // commit("setToken", response.data.access_token);
    },
    submit() {
      console.log(this.registerData.name);
      axiosNonTokenService
        .post("/auth/register", {
          ...this.registerData,
        })
        .then((response) => {
          console.log(response);
          basicAlertSwal("Created user");
          this.$router.push("/login");
        })
        .catch((e) => {
          console.log(e);
          basicAlertSwal(
            e.response.status == 400
              ? "This user already exists"
              : "Created Error",
            "error"
          );
        });
    },
    readToken() {
      this.tokenNow = this.$store.state.token;
    },
  },
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;
}
*:focus {
  outline: none;
}
.container {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.logo1 {
  width: 500px;
  height: 100px;
  background-image: url("../assets/HardworderSWG.svg");
  background-repeat: no-repeat;
  background-position: center;
}
input[type="text"],
input[type="email"],
input[type="password"] {
  width: 280px;
  transition: 0.25s;
  text-align: center;
  padding: 15px 30px;
  font-size: 20px;
  margin: 5px 0 30px 0;
  border: none;
  border-radius: 15px;
  /* border-bottom: 2px solid rgba(0, 0, 0, 0.1);
     */
  border: 2px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.3);
}
.login-div button {
  padding: 15px 50px;
  margin: 20px 0px 10px 0px;
  border-radius: 15px;
  background-color: white;
  color: white;
  border: none;
  font-size: 20px;
  color: red;
  border: 2px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.3);
}
input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus {
  transition: 0.5s;
  width: 380px;
}
.login-div button:hover {
  background-color: red;
  color: white;
  transition: 0.5s;
}
</style>
