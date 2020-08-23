<template>
  <div class="word-edit">
    <div class="form-group">
      <label>TR</label>
      <input
        class="form-control"
        placeholder="Tr"
        v-model="wordData.valTr1"
        type="text"
      />
      <label>ENG</label>
      <input
        class="form-control"
        placeholder="Eng"
        v-model="wordData.valEng1"
        type="text"
      />
    </div>
    <button @click="add" class="btn btn-primary">Add</button>
    <button @click="readToken">Tokenı Al</button>
    {{ tokenNow }}
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      wordData: {
        valTr1: "",
        valTr2: "",
        valTrAF: "",
        valEng1: "",
        valEng2: "",
        valEngAF: ""
      },
      tokenNow: ""
    };
  },
  name: "Edit",
  components: {},
  methods: {
    async add() {
      await axios
        .post(
          "http://localhost:5000/api/dic/add",
          { ...this.wordData },
          {
            headers: {
              Authorization: `Bearer: ${this.$store.state.token}`
            }
          }
        )
        .then(response => {
          console.log(response);
          console.log(this.$store.state.token);
        })
        .catch(e => console.log(e));
    },
    readToken() {
      this.tokenNow = this.$store.state.token;
    }
  }
};
</script>
