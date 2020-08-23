<style>
.word {
  color: red;
  font-weight: bolder;
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
        .get("http://localhost:5000/api/dic/treng1", {
          headers: {
            Authorization: `Bearer: ${this.$store.state.token}`
          }
        })
        .then(response => {
          console.log(response.data);
          // console.log(this.article.toUpperCase().includes("APPLE"));
          this.article = this.article.toLowerCase();
          response.data.data.forEach(element => {
            if (this.article.includes(element.valEng1.toLowerCase())) {
              this.article = this.article.replace(
                element.valEng1.toLowerCase(),
                `<span class='word' title='${
                  element.valTr1
                }'>${element.valEng1.toLowerCase()}</span>`
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
