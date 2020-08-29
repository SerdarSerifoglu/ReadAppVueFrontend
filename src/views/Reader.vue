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
  <div class="reader">
    <div class="form-group">
      <textarea v-if="openTextArea" v-model="article"></textarea>
    </div>
    <button @click="getWords" class="btn btn-primary">Add</button>
    <p v-html="article" v-if="openTextArea"></p>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      // "I will eat <span class='word' title='elma'>apple</span>",
      article: "I will eat apple by",
      openTextArea: true,
      word: {}
    };
  },
  name: "Edit",
  components: {},
  methods: {
    async getWords() {
      await axios
        .get("http://localhost:5000/api/dic/treng", {
          headers: {
            Authorization: `Bearer: ${this.$store.state.token}`
          }
        })
        .then(response => {
          console.log(response.data);
          // console.log(this.article.toUpperCase().includes("APPLE"));
          this.article = this.article.toLowerCase();
          response.data.data.forEach(element => {
            if (
              this.article.includes(" " + element.valEng1.toLowerCase() + " ")
            ) {
              this.article = this.article.replace(
                element.valEng1.toLowerCase(),
                `<span class='tooltip'>${element.valEng1.toLowerCase()}
                 <span class="custom critical">
                <em>${element.valEng1.toLowerCase()}</em>
                ${element.valTr1.toLowerCase()}</span>
              </span>`
              );
            }
          });
        })
        .catch(e => console.log(e));
    },
    readToken() {
      this.tokenNow = this.$store.state.token;
    }
  }
};
</script>
