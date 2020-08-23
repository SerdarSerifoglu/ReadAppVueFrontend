<template>
  <div class="register">
    <input
      placeholder="isim soyisim giriniz"
      v-model="registerData.name"
      type="text"
    />
    <input
      placeholder="e-mail giriniz"
      v-model="registerData.email"
      type="text"
    />
    <input
      placeholder="şifre giriniz"
      v-model="registerData.password"
      type="text"
    />
    <button @click="submit">Kayıt Ol</button>
    <button @click="readToken">Tokenı Al</button>
    {{ tokenNow }}
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      registerData: {
        name: "",
        email: "",
        password: ""
      },
      tokenNow: ""
    };
  },
  name: "Register",
  components: {},
  methods: {
    submit() {
      axios
        .post("http://localhost:5000/api/auth/register", {
          ...this.registerData
        })
        .then(response => {
          console.log(response);
        })
        .catch(e => console.log(e));
    },
    readToken() {
      this.tokenNow = this.$store.state.token;
    }
  }
};
</script>
