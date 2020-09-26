<style>
.tooltip {
  border-bottom: 1px dotted #000000;
  color: #000000;
  outline: none;
  cursor: help;
  text-decoration: none;
  position: relative;
  color: red;
  font-weight: bolder;
}
.tooltip span {
  margin-left: -999em;
  position: absolute;
}
.tooltip:hover span {
  border-radius: 5px 5px;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 5px 5px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 5px 5px rgba(0, 0, 0, 0.1);
  font-family: Calibri, Tahoma, Geneva, sans-serif;
  position: absolute;
  left: 1em;
  top: 2em;
  z-index: 99;
  margin-left: 0;
  width: 250px;
}
.tooltip:hover em {
  font-family: Candara, Tahoma, Geneva, sans-serif;
  font-size: 1.2em;
  font-weight: bold;
  display: block;
  padding: 0.2em 0 0.6em 0;
}
.custom {
  padding: 0.5em 0.8em 0.8em 2em;
}
.critical {
  background: #ffccaa;
  border: 1px solid #ffad33;
}
</style>

<template>
  <div class="container">
    <app-combobox
      :mainData="packComboboxData"
      @comboboxChange="selectedPack = $event"
    />
    <p>{{ words }}</p>
    <div class="reader">
      <div class="form-group">
        <textarea v-if="openTextArea" v-model="article"></textarea>
      </div>
      <button @click="packComboboxChange" class="btn btn-primary">Add</button>

      <p v-html="article" v-if="openTextArea"></p>
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
      article: "I will eat apple by",
      openTextArea: true,
      word: {}
    };
  },
  name: "Edit",
  components: {
    "app-combobox": Combobox
  },
  methods: {
    packComboboxChange: async function() {
      await axios
        .get("http://localhost:5000/api/pack/" + this.selectedPack + "/words", {
          headers: {
            Authorization: `Bearer: ${this.$store.state.token}`
          }
        })
        .then(response => {
          this.words = response.data.data[0].words;
          console.log(this.words);
          this.words.forEach(element => {
            if (
              this.article.includes(" " + element.mainWord.toLowerCase() + " ")
            ) {
              var findValue = " " + element.mainWord.toLowerCase() + " ";
              var regex = new RegExp(findValue, "gi");
              this.article = this.article.replace(
                regex,
                `<span class='tooltip'>${findValue}<span class="custom critical"><em>${findValue}</em>${element.secondaryWord.toLowerCase()}</span></span>`
              );
            }
          });
        })
        .catch(e => console.log(e));
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
