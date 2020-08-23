<template>
  <div class="login">
    <input placeholder="e-mail giriniz" v-model="loginData.email" type="text" />
    <input
      placeholder="şifre giriniz"
      v-model="loginData.password"
      type="text"
    />
    <button @click="submit">Giriş Yap</button>
    <button @click="readToken">Tokenı Al</button>
    {{ tokenNow }}
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      loginData: {
        email: "",
        password: ""
      },
      tokenNow: ""
    };
  },
  name: "Login",
  components: {},
  methods: {
    submit() {
      axios
        .post("http://localhost:5000/api/auth/login", { ...this.loginData })
        .then(response => {
          this.$store.state.token = response.data.access_token;
          console.log(this.$store.state.token);
        })
        .catch(e => console.log(e));
    },
    readToken() {
      this.tokenNow = this.$store.state.token;
    }
  }
};
</script>
