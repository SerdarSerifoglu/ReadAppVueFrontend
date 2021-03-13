<template>
  <div>
    <app-combobox
      classValue="col-sm-6"
      :mainData="packComboboxData"
      @comboboxChange="packComboboxChange($event)"
      :currentValue="comboboxCurrentValue"
    />
    <button class="btn btn-primary btn-md" @click="newWord()">
      <span>
        <i class="fas fa-plus"></i>
      </span>
      Add Word
    </button>

    <word-list
      :listData="words"
      @editClick="
        editButtonClick($event.id, $event.mainWord, $event.secondaryWord)
      "
      @deleteClick="deleteButtonClick($event)"
    ></word-list>

    <!-- Modal -->

    <div
      class="modal fade bd-example-modal-sm"
      tabindex="-1"
      role="dialog"
      aria-labelledby="mySmallModalLabel"
      aria-hidden="true"
      v-bind:class="{
        show: modalDisplay,
      }"
      v-bind:style="{
        display: modalDisplayValue,
      }"
    >
      <div class="modal-dialog" id="addPackModal">
        <div class="modal-content">
          <div style="margin: 2rem">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Save Word</h5>
              <button
                type="button"
                @click="modalClick()"
                style="
                  border: 0;
                  padding: 3px;
                  background-color: #fff;
                  cursor: pointer;
                "
              >
                <span>X</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="addWord">
                <app-input
                  ref="mainWord"
                  childRef="theInput"
                  @input="$v.wordData.mainWord.$touch()"
                  :inputClass="{
                    'form-control': true,
                    'is-invalid': $v.wordData.mainWord.$error,
                  }"
                  inputId="mainWord"
                  label="Main Word"
                  divClass="col-md-12 col-xs-12"
                  v-model="wordData.mainWord"
                  :dataValue="wordData.mainWord"
                  :attention1="$v.wordData.mainWord.required"
                  attention1Text="Main word is required !"
                  @keydown.native.enter="wordSubmit"
                ></app-input>
                <app-input
                  @input="$v.wordData.secondaryWord.$touch()"
                  :inputClass="{
                    'form-control': true,
                    'is-invalid': $v.wordData.secondaryWord.$error,
                  }"
                  inputId="secondaryWord"
                  label="Secondary Word"
                  divClass="col-md-12 col-xs-12"
                  v-model="wordData.secondaryWord"
                  :dataValue="wordData.secondaryWord"
                  :attention1="$v.wordData.secondaryWord.required"
                  attention1Text="Secondary word is required !"
                  @keydown.native.enter="wordSubmit"
                ></app-input>
              </div>
            </div>
            <div class="modal-footer">
              <button
                class="btn btn-success center"
                @click="wordSubmit"
                :disabled="$v.wordData.$invalid"
              >
                <i class="far fa-save" style="margin-right: 3px"></i> SAVE
              </button>
              <button class="btn btn-danger center" @click="modalClick()">
                <i class="far fa-window-close" style="margin-right: 3px"></i>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal End -->

    <loading></loading>
  </div>
</template>

<script>
import Input from "../../components/Input.vue";
import Combobox from "../../components/Combobox.vue";
import { required } from "vuelidate/lib/validators";
import WordList from "../../components/WordList.vue";
import axiosService from "../../helpers/axiosHelper.js";
import axiosNonLoadingService from "../../helpers/axiosHelperNonLoading.js";
import Loading from "../../components/Loading.vue";

export default {
  data() {
    return {
      modalDisplay: false,
      modalDisplayValue: "none",
      selectedPack: "",
      packComboboxData: [],
      words: [],
      wordData: {
        mainWord: "",
        secondaryWord: "",
      },
    };
  },
  validations: {
    wordData: {
      mainWord: { required },
      secondaryWord: { required },
    },
  },
  components: {
    "app-input": Input,
    "app-combobox": Combobox,
    "word-list": WordList,
    loading: Loading,
  },
  methods: {
    wordSubmit: function () {
      this.wordData._id != undefined ? this.updateWord() : this.saveWord();
    },
    modalClick: function () {
      this.modalDisplay = !this.modalDisplay;
      this.wordData = { ...this.wordData };
      if (this.modalDisplay) {
        this.modalDisplayValue = "block";
      } else {
        this.modalDisplayValue = "none";
      }
    },
    packComboboxChange: async function (event) {
      this.selectedPack = event;
      await axiosService
        .get("/pack/" + this.selectedPack + "/words")
        .then((response) => {
          this.words = response.data.data[0].words;
        })
        .catch((e) => console.log(e));
    },
    editButtonClick: async function (wordId, mainWord, secondaryWord) {
      this.wordData._id = wordId;
      this.wordData.mainWord = mainWord;
      this.wordData.secondaryWord = secondaryWord;
      this.modalClick();
    },
    deleteButtonClick: async function (wordId) {
      await axiosService
        .delete("/pack/" + this.selectedPack + "/word/" + wordId)
        .then((response) => {
          response;
          this.packComboboxChange(this.selectedPack);
        })
        .catch((e) => console.log(e));
    },
    saveWord: async function () {
      await axiosService
        .post("/pack/" + this.selectedPack + "/word", { ...this.wordData })
        .then((response) => {
          console.log(response);
          this.packComboboxChange(this.selectedPack);
          this.resetWordData();
          this.$refs.mainWord.$refs.theInput.focus();
        })
        .catch((e) => console.log(e));
    },
    updateWord: async function () {
      await axiosService
        .put("/pack/" + this.selectedPack + "/word", { ...this.wordData })
        .then((response) => {
          console.log(response);
          this.packComboboxChange(this.selectedPack);
          this.resetWordData();
          this.$refs.mainWord.$refs.theInput.focus();
        })
        .catch((e) => console.log(e));
    },
    resetWordData: function () {
      this.wordData = {
        mainWord: "",
        secondaryWord: "",
      };
    },
    newWord: function () {
      this.wordData = {};
      this.modalClick();
    },
    async refreshList() {
      await axiosService
        .get("/pack/" + this.selectedPack + "/words")
        .then((response) => {
          this.words = response.data.data[0].words;
        })
        .catch((e) => console.log(e));
    },
  },
  created() {
    this.comboboxCurrentValue = this.$store.getters.getUserSettings.selectedPackId;
    if (this.selectedPack === "") {
      this.selectedPack = this.comboboxCurrentValue;
    }

    axiosNonLoadingService
      .get("/pack/forCbx")
      .then((response) => {
        this.packComboboxData = response.data.data;
      })
      .catch((e) => console.log(e));
    this.refreshList();
  },
};
</script>

<style scoped></style>
