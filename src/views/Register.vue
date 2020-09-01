<template>
  <div class="register">
    <!-- <input
      placeholder="isim soyisim giriniz"
      v-model="registerData.name"
      type="text"
    /> -->
    <div>{{ registerData.name }}</div>
    <div>{{ registerData.password }}</div>
    <app-input
      v-model="registerData.name"
      label="Name"
      inputId="name"
      divClass="col-md-4"
    ></app-input>
    <app-input
      v-model="registerData.email"
      label="E-mail"
      inputId="email"
      divClass="col-md-4"
      typeName="email"
    ></app-input>
    <app-input
      v-model="registerData.password"
      typeName="password"
      label="Şifre"
      inputId="sifre"
      divClass="col-md-4"
    ></app-input>
    <button @click="submit">Kayıt Ol</button>
    <button @click="readToken">Tokenı Al</button>
    {{ tokenNow }}
  </div>
</template>

<script>
import axios from "axios";
import Input from "../components/Input.vue";
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
  components: {
    "app-input": Input
  },
  methods: {
    submit() {
      console.log(this.registerData.name);
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
