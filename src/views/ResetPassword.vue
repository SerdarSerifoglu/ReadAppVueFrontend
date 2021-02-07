<style scoped>
.resetPassword {
  padding-right: 5%;
  padding-left: 5%;
}
</style>

<template>
  <div class="resetPassword">
    <app-input
      @input="$v.password.$touch()"
      :inputClass="{
        'form-control': true,
        'is-invalid': $v.password.$error,
      }"
      inputId="password"
      typeName="password"
      label="Password"
      divClass="col-xs-12 col-md-6 col-xl-6"
      v-model.trim="password"
      :dataValue="password"
      :attention1="$v.password.required"
      attention1Text="Password is required !"
    ></app-input>
    <app-input
      @input="$v.repeatPassword.$touch()"
      :inputClass="{
        'form-control': true,
        'is-invalid': $v.repeatPassword.$error,
      }"
      inputId="repeatPassword"
      typeName="password"
      label="Repeat Password"
      divClass="col-xs-12 col-md-6 col-xl-6"
      v-model.trim="repeatPassword"
      :dataValue="repeatPassword"
      :attention1="$v.repeatPassword.required"
      attention1Text="Repeat Password is required !"
    ></app-input>

    <button
      class="btn btn-primary"
      @click="resetPassword"
      :disabled="
        !$v.password.required ||
          !$v.password.minLength ||
          !$v.repeatPassword.sameAsPassword
      "
    >
      Change My Password
    </button>
  </div>
</template>

<script>
import axios from "axios";
import Input from "../components/Input.vue";
import { required, minLength, sameAs } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      password: "",
      repeatPassword: "",
    };
  },
  validations: {
    password: {
      required,
      minLength: minLength(6),
    },
    repeatPassword: {
      sameAsPassword: sameAs("password"),
    },
  },
  components: {
    "app-input": Input,
  },
  methods: {
    resetPassword: async function() {
      var resetToken = this.$route.query.resetPasswordToken;
      console.log(this.$route.query);
      //düzenlenicek
      await axios
        .put(`/auth/resetpassword?resetPasswordToken=${resetToken}`, {
          password: this.password,
        })
        .then(response => {
          console.log(response);
          alert("Change you password");
        })
        .catch(e => console.log(e));
    },
  },
};
</script>
