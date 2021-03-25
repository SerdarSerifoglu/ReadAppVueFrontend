<style scoped>
.forgotPassword {
  padding-right: 5%;
  padding-left: 5%;
}
</style>

<template>
  <div class="forgotPassword">
    <app-input
      @input="$v.email.$touch()"
      :inputClass="{
        'form-control': true,
        'is-invalid': $v.email.$error,
      }"
      inputId="email"
      typeName="email"
      label="Email"
      divClass="col-xs-12 col-md-6 col-xl-6"
      v-model="email"
      :dataValue="email"
      :attention1="$v.email.required"
      attention1Text="Email is required !"
    ></app-input>
    <button
      class="btn btn-primary"
      @click="sendResetInstruction"
      :disabled="!$v.email.email || !$v.email.required"
    >
      Send me reset instructions
    </button>
    <loading></loading>
  </div>
</template>

<script>
import axiosNonTokenService from "../helpers/axiosHelperNonToken.js";
import Input from "../components/Input.vue";
import { required, email } from "vuelidate/lib/validators";
import { basicAlertSwal } from "../helpers/alertHelper.js";
import Loading from "../components/Loading.vue";

export default {
  data() {
    return {
      email: "",
    };
  },
  validations: {
    email: {
      required,
      email,
    },
  },
  components: {
    "app-input": Input,
    loading: Loading,
  },
  methods: {
    sendResetInstruction: function () {
      axiosNonTokenService
        .post("/auth/forgotpassword", { email: this.email })
        .then((response) => {
          response;
          basicAlertSwal("Send mail this address for reset password");
        })
        .catch((e) => console.log(e));
    },
  },
};
</script>
