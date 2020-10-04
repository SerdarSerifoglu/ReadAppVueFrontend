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
          rows="3"
          style="margin-top:0.5rem"
        ></textarea>
      </div>
      <button @click="readButtonClick" class="btn btn-success">Read</button>
      <button
        @click="clickNewArticleButton"
        class="btn btn-primary"
        style="margin-left:0.5rem"
      >
        New Article
      </button>

      <p v-html="readArticle" v-if="!openTextArea"></p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Combobox from "../components/Combobox.vue";
export default {
  data() {
    return {
      selectedPack: "",
      packComboboxData: [],
      words: [],
      article: "",
      readArticle: "",
      openTextArea: true,
      clickedReadButton: false
    };
  },
  name: "Edit",
  components: {
    "app-combobox": Combobox
  },
  methods: {
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
            var search = element.mainWord.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&"
            );

            var re = new RegExp(search, "gi");

            this.readArticle = this.readArticle.replace(
              re,
              `<span class='tooltipS'>${element.mainWord}<span class="tooltiptext"><em>${element.mainWord}</em> <br>${element.secondaryWord}</span></span>`
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
