<style>
a {
  text-decoration: none;
}
a:hover {
  color: red;
}
.tooltipS {
  position: relative;
  display: inline-block;
  color: red;
  font-weight: bold;
}
.tooltipS .tooltiptext {
  visibility: hidden;
  width: auto;
  max-width: 300px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  opacity: 0.8;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  top: -40px;
  left: 110%;
}

.tooltipS:hover .tooltiptext {
  visibility: visible;
}
.tooltipS:focus .tooltiptext {
  visibility: visible;
}
span {
  white-space: pre-wrap;
}
.articleBoard {
  border: 1px solid black;
  border-radius: 0.2rem;
  margin: 1rem;
  padding: 0.5rem;
}
</style>

<template>
  <div class="container" style="margin-top: 75px">
    <div class="mainView" @mouseup="selectWord">
      <div class="row">
        <div class="col-sm-3">
          <label>Choose Pack</label>
        </div>
        <app-combobox
          classValue="col-sm-6"
          :mainData="packComboboxData"
          @comboboxChange="selectedPack = $event"
          :currentValue="comboboxCurrentValue"
        />

        <div class="col-sm-3">
          <button
            type="button"
            class="btn btn-primary float-right"
            @click="addWordButtonClick()"
          >
            Add Word
          </button>
        </div>
      </div>

      <div class="reader">
        <app-input
          @input="$v.articleData.title.$touch()"
          :inputClass="{
            'form-control': true,
            'is-invalid': $v.articleData.title.$error,
          }"
          inputId="articleTitle"
          label="Article Title"
          divClass="col-md-12 col-xs-12"
          v-model="articleData.title"
          :dataValue="articleData.title"
          :attention1="$v.articleData.title.required"
          attention1Text="Title is required !"
        ></app-input>
        <app-input
          @input="$v.articleData.description.$touch()"
          :inputClass="{
            'form-control': true,
            'is-invalid': $v.articleData.description.$error,
          }"
          inputId="articleDescription"
          label="Article Description"
          divClass="col-md-12 col-xs-12"
          v-model="articleData.description"
          :dataValue="articleData.description"
          :attention1="$v.articleData.description.required"
          attention1Text="Description is required !"
        ></app-input>
        <div class="form-group">
          <textarea
            v-if="openTextArea"
            v-model="articleData.article"
            @input="$v.articleData.article.$touch()"
            :class="{
              'form-control': true,
              'is-invalid': $v.articleData.article.$error,
            }"
            id="exampleFormControlTextarea1"
            rows="15"
            style="margin-top: 0.5rem"
          ></textarea>
          <small class="text-danger" v-if="!$v.articleData.article.required"
            >Article is required !</small
          >
        </div>
        <button
          @click="readButtonClick"
          class="btn btn-success btn-lg"
          :disabled="
            !$v.selectedPack.required || !$v.articleData.article.required
          "
        >
          READ
        </button>
        <button
          @click="clickNewArticleButton"
          class="btn btn-primary btn-lg"
          style="margin-left: 0.5rem"
        >
          CHANGE ARTICLE
        </button>
        <button
          @click="saveArticle"
          class="btn btn-warning btn-lg"
          style="margin-left: 0.5rem"
          :disabled="$v.articleData.$invalid"
        >
          SAVE ARTICLE
        </button>

        <p
          class="articleBoard col-xs-12"
          v-html="readArticle"
          v-if="!openTextArea"
        ></p>
      </div>
    </div>

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
      <div class="modal-dialog" id="addWordModal">
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
              <app-input
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
              ></app-input>
            </div>
            <div class="modal-footer">
              <button
                class="btn btn-success center"
                @click="insertOrUpdateWord()"
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
    <p>{{ wordData }}</p>

    <article-list
      :listData="articles"
      @selectClick="
        selectButtonClick(
          $event.id,
          $event.title,
          $event.description,
          $event.article
        )
      "
      @deleteClick="deleteButtonClickInArticleList($event)"
    ></article-list>
    <loading></loading>
  </div>
</template>

<script>
import axiosService from "../helpers/axiosHelper.js";
import axiosNonLoadingService from "../helpers/axiosHelperNonLoading.js";
import { required } from "vuelidate/lib/validators";
import Combobox from "../components/Combobox.vue";
import Input from "../components/Input.vue";
import ArticleList from "../components/ArticleList.vue";
import { basicAlertSwal } from "../helpers/alertHelper.js";
import Loading from "../components/Loading.vue";

export default {
  data() {
    return {
      comboboxCurrentValue: this.$store.getters.getUserSettings.selectedPackId,
      userSettingColor: this.$store.getters.getUserSettings.color ?? "FF2D00",
      modalDisplayValue: "none",
      modalDisplay: false,
      selectData: "",
      selectedPack: "",
      packComboboxData: [],
      words: [],
      article: "",
      readArticle: "",
      openTextArea: true,
      clickedReadButton: false,
      wordData: {
        mainWord: "",
        secondaryWord: "",
      },
      articleData: {
        title: "",
        description: "",
        article: "",
      },
      articles: [],
    };
  },
  validations: {
    articleData: {
      title: { required },
      description: { required },
      article: { required },
    },
    wordData: {
      mainWord: { required },
      secondaryWord: { required },
    },
    selectedPack: {
      required,
    },
  },
  name: "Edit",
  components: {
    "app-combobox": Combobox,
    "app-input": Input,
    "article-list": ArticleList,
    loading: Loading,
  },
  methods: {
    async selectWord() {
      this.selectData = window.getSelection().toString();
      if (this.selectData == "") {
        return;
      }
      this.wordData = {};
      this.wordData.mainWord = this.selectData;

      await axiosNonLoadingService
        .get("/pack/" + this.selectedPack + "/word/" + this.selectData)
        .then((response) => {
          console.log(response.data.data[0]);
          if (response.data.data[0] != undefined) {
            this.wordData = response.data.data[0];
          }
        })
        .catch((e) => console.log(e));
    },
    readButtonClick: async function () {
      if (this.selectedPack == "") {
        alert("Please select pack to read");
        return;
      }
      if (this.clickedReadButton) return;

      this.clickedReadButton = true;
      this.openTextArea = false;

      await axiosService
        .get("/pack/" + this.selectedPack + "/words")
        .then((response) => {
          this.words = response.data.data[0].words;

          this.words.sort(function (a, b) {
            return b.mainWord.length - a.mainWord.length;
          });
          console.log(this.words);
          this.readArticle = this.articleData.article;
          this.words.forEach((element) => {
            var regx = new RegExp(
              "(\\b" + element.mainWord + "\\b)(?!^>)(?![^<>]*<*>)",
              "gi"
            );
            console.log(regx);
            this.readArticle = this.readArticle.replace(
              regx,
              `<a href="#" class="tooltipS" style="color:#${this.userSettingColor}">${element.mainWord}<span class="tooltiptext">${element.secondaryWord}</span></a>`
            );
          });
        })
        .catch((e) => console.log(e));
    },
    clickNewArticleButton() {
      this.clickedReadButton = false;
      this.openTextArea = true;
    },
    readToken() {
      this.tokenNow = this.$store.state.token;
    },
    insertOrUpdateWord: async function () {
      //işlem uygulanıcak data varsa update yoksa add
      // aynı isimde kelime varsa kayıt esnasında hata fırlatıyoruz bu daha sonra update yapılsın mı diye sorulacak halde alert verdirilecek. onaylanırsa update yapılacak.
      if (this.wordData._id === undefined) {
        await axiosService
          .post("/pack/" + this.selectedPack + "/word", { ...this.wordData })
          .then((response) => {
            console.log(response);
            basicAlertSwal("Word added");
          })
          .catch((e) => console.log(e));
      } else {
        await axiosService
          .put("/pack/" + this.selectedPack + "/word", { ...this.wordData })
          .then((response) => {
            console.log(response);
            basicAlertSwal("Word updated");
          })
          .catch((e) => console.log(e));
      }
      this.wordData = {};
    },
    saveArticle: async function () {
      if (this.articleData._id === undefined || this.articleData._id === "") {
        await axiosService
          .post("/article/add/", { ...this.articleData })
          .then((response) => {
            console.log(response);
            basicAlertSwal("Article added");
            this.refreshArticleList();
          })
          .catch((e) => console.log(e));
      } else {
        await axiosService
          .put("/article/add/", { ...this.articleData })
          .then((response) => {
            console.log(response);
            basicAlertSwal("Article updated");
            this.articleData._id === "";
            this.refreshArticleList();
          })
          .catch((e) => console.log(e));
      }
    },
    modalClick: function () {
      this.modalDisplay = !this.modalDisplay;
      if (this.modalDisplay) {
        this.modalDisplayValue = "block";
      } else {
        this.modalDisplayValue = "none";
      }
    },
    async addWordButtonClick() {
      this.modalClick();
    },
    selectButtonClick: async function (
      articleId,
      articleTitle,
      articleDescription,
      article
    ) {
      this.articleData = {};
      this.articleData._id = articleId;
      this.articleData.title = articleTitle;
      this.articleData.description = articleDescription;
      this.articleData.article = article;
    },
    deleteButtonClickInArticleList: async function (articleId) {
      await axiosService
        .delete("/article/" + articleId)
        .then((response) => {
          response;
          basicAlertSwal("Deleted article");
          this.refreshArticleList();
        })
        .catch((e) => console.log(e));
    },
    refreshArticleList: function () {
      axiosNonLoadingService
        .get("/article/")
        .then((response) => {
          this.articles = response.data.data;
          console.log(this.articles);
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
      .catch((e) => {
        e;
      });
    this.$store.dispatch("setUserSettings");
    this.refreshArticleList();
  },
  watch: {
    articleData() {
      this.clickedReadButton = false;
      this.openTextArea = true;
    },
  },
};
</script>
