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
  z-index: 100;
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

.reader-main {
  display: flex;
  align-items: center;
  justify-content: center;
}
.reader-component {
  width: 100vw;
  height: 100vh;

  display: grid;
  grid-template-columns: minmax(30%, min-content) minmax(min-content, 1fr);
  grid-template-rows:
    minmax(min-content, max-content) minmax(min-content, min-content)
    1fr;
}
.reader-editor {
  padding: 0.8rem;
  grid-row: 1 / span 1;
  grid-column: 1 / span 1;

  display: grid;
  grid-template-columns:
    minmax(min-content, max-content) minmax(min-content, max-content)
    minmax(min-content, max-content);
  grid-template-rows: 1fr;
  grid-gap: 0.5rem;
  justify-items: center;
  align-items: center;
  justify-self: center;
  align-self: center;
}
.reader-editor-label {
  grid-column: 1 / span 1;
  grid-row: 1 / -1;
  width: 100%;
}
.reader-editor-combobox {
  grid-column: 2 / span 1;
  grid-row: 1 / -1;
  /* width: 100%; */
}
.reader-editor-button {
  grid-column: 3 / span 1;
  grid-row: 1 / -1;
}
.reader-article {
  padding: 0.8rem;
  grid-row: 1 / -1;
  grid-column: 2 / span 1;
}
.reader-list {
  overflow: scroll;
  padding: 0.8rem;
  grid-row: 2 / span 2;
  grid-column: 1 / span 1;
}
@media only screen and (max-width: 1000px) {
  .reader-list {
    overflow: visible;
    grid-column: 1 / -1;
    grid-row: 3 / span 1;
  }
  .reader-article {
    grid-column: 1 / -1;
    grid-row: 1 / span 1;
  }
  .reader-editor {
    grid-column: 1 / -1;
    grid-row: 2 / span 1;
  }
}
</style>

<template>
  <div>
    <div class="reader-main">
      <div class="reader-component">
        <div class="reader-article">
          <div class="form-group">
            <div
              contenteditable="true"
              ref="articleRef"
              v-if="openTextArea"
              @input="
                feedArticleData($event);
                $v.articleData.article.$touch();
              "
              @mouseup="selectWord"
              :class="{
                'form-control': true,
                'is-invalid': $v.articleData.article.$error,
              }"
              id="exampleFormControlTextarea1"
              style="margin-top: 0.5rem; margin-bottom: 0.5rem"
              placeholder="Copy the text you want to read here..."
            ></div>
            <small class="text-danger" v-if="!$v.articleData.article.required"
              >Article is required !</small
            >
            <p
              class="articleBoard col-xs-12"
              v-html="readArticle"
              v-if="!openTextArea"
            ></p>
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
            type="button"
            class="btn btn-danger btn-lg"
            style="margin-left: 0.5rem; color: #fff"
            @click="saveArticleModalClick()"
            :disabled="$v.articleData.article.$invalid"
          >
            SAVE ARTICLE
          </button>
          <button
            type="button"
            class="btn btn-danger btn-lg"
            style="margin-left: 0.5rem; color: #fff"
            @click="newArticleModalClick()"
            :disabled="$v.articleData.article.$invalid"
          >
            NEW ARTICLE
          </button>
        </div>
        <div class="reader-editor">
          <div class="reader-editor-label">
            <label>Choose Pack</label>
          </div>
          <app-combobox
            classValue="reader-editor-combobox"
            :mainData="packComboboxData"
            @comboboxChange="selectedPack = $event"
            :currentValue="comboboxCurrentValue"
          />

          <div class="reader-editor-button">
            <button
              type="button"
              class="btn btn-primary float-right"
              @click="addWordModalClick()"
            >
              Add Word
            </button>
          </div>
        </div>
        <div class="reader-list">
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
        </div>
      </div>
    </div>

    <div class="container" style="margin-top: 75px">
      <!-- Modal -->
      <div
        class="modal fade bd-example-modal-sm"
        tabindex="-1"
        role="dialog"
        aria-labelledby="mySmallModalLabel"
        aria-hidden="true"
        v-bind:class="{
          show: addWordModalDisplay,
        }"
        v-bind:style="{
          display: addWordModalDisplayValue,
        }"
      >
        <div class="modal-dialog" id="addWordModal">
          <div class="modal-content">
            <div style="margin: 2rem">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">
                  Save Word
                </h5>
                <button
                  type="button"
                  @click="addWordModalClick()"
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
                <button
                  class="btn btn-danger center"
                  @click="addWordModalClick()"
                >
                  <i class="far fa-window-close" style="margin-right: 3px"></i>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Modal End -->

      <!-- Modal For Article -->
      <div
        class="modal fade bd-example-modal-sm"
        tabindex="-1"
        role="dialog"
        aria-labelledby="mySmallModalLabel"
        aria-hidden="true"
        v-bind:class="{
          show: saveArticleModalDisplay,
        }"
        v-bind:style="{
          display: saveArticleModalDisplayValue,
        }"
      >
        <div class="modal-dialog" id="saveAricleModal">
          <div class="modal-content">
            <div style="margin: 2rem">
              <div class="modal-header">
                <h5 class="modal-title" id="modal-title-article">
                  {{ articleModalTitleName }}
                </h5>
                <button
                  type="button"
                  @click="saveArticleModalClick()"
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
              </div>
              <div class="modal-footer">
                <button
                  @click="saveArticle"
                  class="btn btn-warning"
                  style="margin-left: 0.5rem"
                  :disabled="$v.articleData.$invalid"
                >
                  <i class="far fa-save" style="margin-right: 3px"></i> SAVE
                </button>
                <button
                  class="btn btn-danger center"
                  @click="saveArticleModalClick()"
                >
                  <i class="far fa-window-close" style="margin-right: 3px"></i>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Modal For Article End -->

      <loading></loading>
    </div>
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
// import store from "../store/index.js";

export default {
  data() {
    return {
      comboboxCurrentValue: "",
      userSettingColor: this.$store.getters.getUserSettings.color ?? "FF2D00",
      addWordModalDisplayValue: "none",
      addWordModalDisplay: false,
      saveArticleModalDisplayValue: "none",
      saveArticleModalDisplay: false,
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
      articleModalTitleName: "",
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
  computed: {
    comboboxCurrentValueComp() {
      return this.$store.getters.getUserSettings.selectedPackId;
    },
  },
  methods: {
    feedArticleData(e) {
      this.articleData.article = e.target.innerHTML;
    },
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
      this.articleData.article = this.articleData.article + " ";
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
            this.clickedReadButton = false;
            this.readButtonClick();
          })
          .catch((e) => console.log(e));
      } else {
        await axiosService
          .put("/pack/" + this.selectedPack + "/word", { ...this.wordData })
          .then((response) => {
            console.log(response);
            basicAlertSwal("Word updated");
            this.clickedReadButton = false;
            this.readButtonClick();
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
    addWordModalClick: function () {
      this.addWordModalDisplay = !this.addWordModalDisplay;
      if (this.addWordModalDisplay) {
        this.addWordModalDisplayValue = "block";
      } else {
        this.addWordModalDisplayValue = "none";
      }
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
      this.$refs.articleRef.focus();
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
    saveArticleModalClick: function () {
      this.articleModalTitleName = "Save Article";
      this.saveArticleModalDisplay = !this.saveArticleModalDisplay;
      if (this.saveArticleModalDisplay) {
        this.saveArticleModalDisplayValue = "block";
      } else {
        this.saveArticleModalDisplayValue = "none";
      }
    },
    newArticleModalClick: function () {
      delete this.articleData._id;
      this.articleData.title = "";
      this.articleData.description = "";
      this.saveArticleModalClick();
      this.articleModalTitleName = "New Article";
    },
  },
  created() {
    axiosService.defaults.baseURL = process.env.VUE_APP_BASE_PATH;
    axiosService.defaults.headers.common[
      "Authorization"
    ] = `Bearer: ${this.$store.getters.getToken}`;
    axiosNonLoadingService.defaults.baseURL = process.env.VUE_APP_BASE_PATH;
    axiosNonLoadingService.defaults.headers.common[
      "Authorization"
    ] = `Bearer: ${this.$store.getters.getToken}`;

    axiosNonLoadingService
      .get("/pack/forCbx")
      .then((response) => {
        this.packComboboxData = response.data.data;
      })
      .catch((e) => {
        e;
      });

    this.$store.commit("setUserSettings");
    const dd = this.$store.getters.getUserSettings;
    this.comboboxCurrentValue = this.$store.state.userSettings.selectedPackId;
    console.log({ uuuuuu: this.$store.state.userSettings.selectedPackId });
    console.log({ dd: dd });
    console.log({ combobox: this.comboboxCurrentValue });
    console.log({ selectedPack: this.selectedPack });

    if (this.selectedPack === "") {
      this.selectedPack = this.comboboxCurrentValue;
    }
    console.log({ selectedPack2: this.selectedPack });

    this.refreshArticleList();
  },
  // beforeMount() {
  //   // store.dispatch("setUserSettings");
  //   const dd = this.$store.getters.getUserSettings;
  //   this.comboboxCurrentValue = dd.selectedPackId;
  //   console.log({ dd: dd });
  //   console.log({ combobox: this.comboboxCurrentValue });
  //   console.log({ selectedPack: this.selectedPack });

  //   if (this.selectedPack === "") {
  //     this.selectedPack = this.comboboxCurrentValue;
  //   }
  //   console.log({ selectedPack2: this.selectedPack });
  // },
  watch: {
    articleData() {
      this.clickedReadButton = false;
      this.openTextArea = true;
    },
    "$store.state.userSettings.selectedPackId": function () {
      console.log({ serdar: this.$store.state.userSettings.selectedPackId });
      this.selectedPackId = this.$store.state.userSettings.selectedPackId;
      this.comboboxCurrentValue = this.$store.state.userSettings.selectedPackId;
    },
  },
};
</script>
