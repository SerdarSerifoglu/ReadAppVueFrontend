<style scoped>
</style>
<template>
  <div class="userSettings">
    <div class="col-sm-2">
      <label>Choose Pack</label>
    </div>
    <app-combobox
      classValue="col-sm-6"
      :mainData="packComboboxData"
      @comboboxChange="selectedPack = $event"
      :currentValue="comboboxCurrentValue"
    />
    <app-input
      :inputClass="{
        'form-control': true,
      }"
      inputId="wordColor"
      label="Word Color"
      divClass="col-md-12 col-xs-12"
      v-model="wordColor"
      :dataValue="wordColor"
    ></app-input>
    <button class="btn btn-success center" @click="insertOrUpdateWord()">
      <i class="far fa-save" style="margin-right: 3px"></i> SAVE
    </button>
    <loading></loading>
  </div>
</template>
<script>
import Combobox from "../../components/Combobox.vue";
import Input from "../../components/Input.vue";
import axiosService from "../../helpers/axiosHelper.js";
import axiosNonLoadingService from "../../helpers/axiosHelperNonLoading.js";
import Loading from "../../components/Loading.vue";
import { basicAlertSwal } from "../../helpers/alertHelper.js";

export default {
  data() {
    return {
      comboboxCurrentValue: this.$store.getters.getUserSettings.selectedPackId,
      selectedPack: "",
      packComboboxData: [],
      wordColor: this.$store.getters.getUserSettings.color,
      userSettingsId: this.$store.getters.getUserSettings._id,
    };
  },
  components: {
    "app-combobox": Combobox,
    "app-input": Input,
    loading: Loading,
  },
  methods: {
    insertOrUpdateWord: async function () {
      //işlem uygulanıcak data varsa update yoksa add
      if (this.userSettingsId === "") {
        await axiosService
          .post("/userSetting/add", {
            selectedPackId: this.selectedPack,
            wordColor: this.wordColor,
          })
          .then((response) => {
            console.log(response);
            this.$store.dispatch("setUserSettings");
            basicAlertSwal("User Settings added");
          })
          .catch((e) => console.log(e));
      } else {
        await axiosService
          .put("/userSetting/", {
            _id: this.userSettingsId,
            selectedPackId: this.selectedPack,
            wordColor: this.wordColor,
          })
          .then((response) => {
            console.log(response);
            this.$store.dispatch("setUserSettings");
            basicAlertSwal("User Settings updated");
          })
          .catch((e) => console.log(e));
      }
    },
  },
  created() {
    axiosNonLoadingService
      .get("/pack/forCbx")
      .then((response) => {
        this.packComboboxData = response.data.data;
      })
      .catch((e) => {
        e;
        this.$store.dispatch("logout");
      });
  },
};
</script>
