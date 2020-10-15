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
</style>

<template>
  <div class="container" style="margin-top:75px">
    <div class="mainView" @mouseup="selectWord">
      <div class="row">
        <label class="col-md-2">My Packs</label>
        <app-combobox
          classValue="col-md-6"
          :mainData="packComboboxData"
          @comboboxChange="selectedPack = $event"
        />
      </div>
      <div class="reader">
        <div class="form-group">
          <textarea
            v-if="openTextArea"
            v-model="article"
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="15"
            style="margin-top:0.5rem"
          ></textarea>
        </div>
        <button @click="readButtonClick" class="btn btn-success">READ</button>
        <button
          @click="clickNewArticleButton"
          class="btn btn-primary"
          style="margin-left:0.5rem"
        >
          NEW ARTICLE
        </button>

        <p v-html="readArticle" v-if="!openTextArea"></p>
      </div>
    </div>
    <!-- Modal -->
    <button
      type="button"
      class="btn btn-primary"
      data-toggle="modal"
      data-target=".bd-example-modal-sm"
    >
      Small modal
    </button>

    <div
      class="modal fade bd-example-modal-sm"
      tabindex="-1"
      role="dialog"
      aria-labelledby="mySmallModalLabel"
      aria-hidden="true"
      style="margin:5rem"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div style="margin:5rem;">
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
  </div>
</template>

<script>
import axios from "axios";
import Combobox from "../components/Combobox.vue";
import Input from "../components/Input.vue";
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
        secondaryWord: ""
      }
    };
  },
  name: "Edit",
  components: {
    "app-combobox": Combobox,
    "app-input": Input
  },
  methods: {
    async selectWord() {
      this.selectData = window.getSelection().toString();
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
              Authorization: `Bearer: ${this.$store.state.token}`
            }
          }
        )
        .then(response => {
          console.log(response.data.data[0]);
          if (response.data.data[0] != undefined) {
            this.wordData = response.data.data[0];
          }
        })
        .catch(e => console.log(e));
    },
    readButtonClick: async function() {
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
            Authorization: `Bearer: ${this.$store.state.token}`
          }
        })
        .then(response => {
          this.words = response.data.data[0].words;
          this.readArticle = this.article;
          this.words.forEach(element => {
            var regx = new RegExp(
              "(" + element.mainWord + ")(?![^<>]*</)",
              "gi"
            );
            this.readArticle = this.readArticle.replace(
              regx,
              `<span class="tooltipS">$1<span class="tooltiptext">${element.secondaryWord}</span></span>`
            );
          });
        })
        .catch(e => console.log(e));
    },
    clickNewArticleButton() {
      this.clickedReadButton = false;
      this.openTextArea = true;
    },
    readToken() {
      this.tokenNow = this.$store.state.token;
    },
    insertOrUpdateWord: async function() {
      //işlem uygulanıcak data varsa update yoksa add
      if (this.wordData._id === undefined) {
        await axios
          .post(
            "http://localhost:5000/api/pack/" + this.selectedPack + "/word",
            { ...this.wordData },
            {
              headers: {
                Authorization: `Bearer: ${this.$store.state.token}`
              }
            }
          )
          .then(response => {
            console.log(response);
            alert("Word added");
          })
          .catch(e => console.log(e));
      } else {
        await axios
          .put(
            "http://localhost:5000/api/pack/" + this.selectedPack + "/word",
            { ...this.wordData },
            {
              headers: {
                Authorization: `Bearer: ${this.$store.state.token}`
              }
            }
          )
          .then(response => {
            console.log(response);
            alert("Word updated");
          })
          .catch(e => console.log(e));
      }
      this.wordData = {};
    }
  },
  async created() {
    await axios
      .get("http://localhost:5000/api/pack/forCbx", {
        headers: {
          Authorization: `Bearer: ${this.$store.state.token}`
        }
      })
      .then(response => {
        this.packComboboxData = response.data.data;
      })
      .catch(e => console.log(e));
  }
};
</script>
