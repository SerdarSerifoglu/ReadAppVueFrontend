<style scoped>
.userSettings {
}
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
    {{ userSettingsId }}
    <button class="btn btn-success center" @click="insertOrUpdateWord()">
      <i class="far fa-save" style="margin-right: 3px"></i> SAVE
    </button>
  </div>
</template>
<script>
import axios from "axios";
import Combobox from "../../components/Combobox.vue";
import Input from "../../components/Input.vue";

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
  },
  methods: {
    insertOrUpdateWord: async function () {
      //işlem uygulanıcak data varsa update yoksa add
      if (this.userSettingsId === "") {
        await axios
          .post("/userSetting/add", {
            selectedPackId: this.selectedPack,
            wordColor: this.wordColor,
          })
          .then((response) => {
            console.log(response);
            this.$store.dispatch("setUserSettings");
            alert("User Settings added");
          })
          .catch((e) => console.log(e));
      } else {
        await axios
          .put("/userSetting/", {
            _id: this.userSettingsId,
            selectedPackId: this.selectedPack,
            wordColor: this.wordColor,
          })
          .then((response) => {
            console.log(response);
            this.$store.dispatch("setUserSettings");
            alert("User Settings updated");
          })
          .catch((e) => console.log(e));
      }
    },
  },
  async created() {
    axios.defaults.baseURL = process.env.VUE_APP_BASE_PATH;
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer: ${this.$store.state.token}`;
    await axios
      .get("/pack/forCbx")
      .then((response) => {
        this.packComboboxData = response.data.data;
        console.log(this.packComboboxData);
      })
      .catch((e) => {
        e;
        this.$store.dispatch("logout");
      });
  },
};
</script>
