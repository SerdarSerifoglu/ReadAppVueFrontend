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
  </div>
</template>

<script>
import axios from "axios";
import Input from "../components/Input.vue";
import { required, email } from "vuelidate/lib/validators";

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
  },
  methods: {
    sendResetInstruction: async function () {
      await axios
        .post("/auth/forgotpassword", { email: this.email })
        .then((response) => {
          console.log(response);
          alert("Send Mail");
        })
        .catch((e) => console.log(e));
    },
  },
};
</script>