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
input[type="email"],
input[type="password"] {
  width: 280px;
  transition: 0.25s;
  text-align: center;
  padding: 15px 30px;
  font-size: 20px;
  margin: 20px 0px;
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

<template>
  <div class="login">
    <div class="container">
      <div class="logo1"></div>
      <div class="username-div">
        <input type="email" placeholder="Email" v-model="loginData.email" />
      </div>
      <div class="password-div">
        <input
          type="password"
          placeholder="Password"
          v-model="loginData.password"
        />
      </div>
      <div class="login-div">
        <button @click="submit">LOGIN</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginData: {
        email: "",
        password: "",
      },
      tokenNow: "",
    };
  },
  name: "Login",
  components: {},
  methods: {
    submit() {
      //store'daki actionları component üzerinden erişmek için dispatch kullanılır.
      this.$store.dispatch("login", { ...this.loginData });
    },
    readToken() {
      this.tokenNow = this.$store.state.token;
    },
  },
};
</script>
