<style>
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
  top: -25px;
  left: 105%;
}

.tooltipS:hover .tooltiptext {
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
        />

        <div class="col-sm-3">
          <button
            type="button"
            class="btn btn-primary float-right"
            data-toggle="modal"
            data-target=".bd-example-modal-sm"
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
          attention1Text="Title is required"
        ></app-input>
        <app-input
          inputId="articleDescription"
          label="Article Description"
          divClass="col-md-12 col-xs-12"
          v-model="articleData.description"
          :dataValue="articleData.description"
        ></app-input>
        <div class="form-group">
          <textarea
            v-if="openTextArea"
            v-model="articleData.article"
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="15"
            style="margin-top: 0.5rem"
          ></textarea>
        </div>
        <button @click="readButtonClick" class="btn btn-success btn-lg">
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
          :disabled="$v.$invalid"
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
      style="margin: 5rem"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div style="margin: 5rem">
            <app-input
              inputId="mainWord"
              label="Main Word"
              divClass="col-md-12 col-xs-12"
              v-model="wordData.mainWord"
              :dataValue="wordData.mainWord"
            ></app-input>
            <app-input
              inputId="secondaryWord"
              label="Secondary Word"
              divClass="col-md-12 col-xs-12"
              v-model="wordData.secondaryWord"
              :dataValue="wordData.secondaryWord"
            ></app-input>
            <button
              class="btn btn-success col-md-3 center"
              @click="insertOrUpdateWord()"
            >
              ADD
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal End -->
    <p>{{ wordData }}</p>

    <ArticleList @data="articleData = $event"></ArticleList>
  </div>
</template>

<script>
import axios from "axios";
import { required } from "vuelidate/lib/validators";
import Combobox from "../components/Combobox.vue";
import Input from "../components/Input.vue";
import ArticleList from "../components/ArticleList.vue";
export default {
  data() {
    return {
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
    };
  },
  validations: {
    articleData: {
      title: {
        required,
      },
    },
  },
  name: "Edit",
  components: {
    "app-combobox": Combobox,
    "app-input": Input,
    ArticleList,
  },
  methods: {
    async selectWord() {
      this.selectData = window.getSelection().toString();
      if (this.selectData == "") {
        return;
      }
      this.wordData = {};
      this.wordData.mainWord = this.selectData;

      await axios
        .get(
          "http://localhost:5000/api/pack/" +
            this.selectedPack +
            "/word/" +
            this.selectData,
          {
            headers: {
              Authorization: `Bearer: ${this.$store.state.token}`,
            },
          }
        )
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

      await axios
        .get("http://localhost:5000/api/pack/" + this.selectedPack + "/words", {
          headers: {
            Authorization: `Bearer: ${this.$store.state.token}`,
          },
        })
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
              `<span class="tooltipS">${element.mainWord}<span class="tooltiptext">${element.secondaryWord}</span></span>`
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
      if (this.wordData._id === undefined) {
        await axios
          .post(
            "http://localhost:5000/api/pack/" + this.selectedPack + "/word",
            { ...this.wordData },
            {
              headers: {
                Authorization: `Bearer: ${this.$store.state.token}`,
              },
            }
          )
          .then((response) => {
            console.log(response);
            alert("Word added");
          })
          .catch((e) => console.log(e));
      } else {
        await axios
          .put(
            "http://localhost:5000/api/pack/" + this.selectedPack + "/word",
            { ...this.wordData },
            {
              headers: {
                Authorization: `Bearer: ${this.$store.state.token}`,
              },
            }
          )
          .then((response) => {
            console.log(response);
            alert("Word updated");
          })
          .catch((e) => console.log(e));
      }
      this.wordData = {};
    },
    saveArticle: async function () {
      if (this.articleData.title === "") {
        return;
      }
      var articleModel = {};
      await axios
        .get(
          "http://localhost:5000/api/article/title/" + this.articleData.title,
          {
            headers: {
              Authorization: `Bearer: ${this.$store.state.token}`,
            },
          }
        )
        .then((response) => {
          if (response.data.data != []) {
            articleModel = response.data.data[0];
          }
        })
        .catch((e) => console.log(e));
      console.log(articleModel);
      if (articleModel === undefined) {
        await axios
          .post(
            "http://localhost:5000/api/article/add/",
            { ...this.articleData },
            {
              headers: {
                Authorization: `Bearer: ${this.$store.state.token}`,
              },
            }
          )
          .then((response) => {
            console.log(response);
            alert("Article added");
          })
          .catch((e) => console.log(e));
      } else {
        articleModel = { ...articleModel, ...this.articleData };
        await axios
          .put(
            "http://localhost:5000/api/article/add/",
            { ...articleModel },
            {
              headers: {
                Authorization: `Bearer: ${this.$store.state.token}`,
              },
            }
          )
          .then((response) => {
            console.log(response);
            alert("Article saved");
          })
          .catch((e) => console.log(e));
      }
    },
  },
  async created() {
    console.log("Created Reader: " + this.$store.state.token);
    await axios
      .get("http://localhost:5000/api/pack/forCbx", {
        headers: {
          Authorization: `Bearer: ${this.$store.state.token}`,
        },
      })
      .then((response) => {
        this.packComboboxData = response.data.data;
      })
      .catch((e) => {
        console.log(e.status, e.message);
        this.$store.dispatch("clearToken");
      });
  },
  watch: {
    articleData() {
      this.clickedReadButton = false;
      this.openTextArea = true;
    },
  },
};
</script>
