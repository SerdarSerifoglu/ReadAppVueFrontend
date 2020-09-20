<template>
  <div>
    <select
      class="form-control col-md-4"
      @change="packComboboxChange($event)"
      v-model="selectedPack"
    >
      <option
        v-for="item in packComboboxData"
        :value="item._id"
        :key="item._id"
        >{{ item.title }}</option
      >
    </select>
    <button class="btn btn-primary btn-md">
      <span>
        <i class="fas fa-plus"></i>
      </span>
      Add Word
    </button>
    <div class="addWord">
      <app-input
        inputId="mainWord"
        label="Main"
        divClass="col-md-6 col-xs-12"
        v-model="wordData.firstWordValue"
        :dataValue="wordData.firstWordValue"
      ></app-input>
      <app-input
        inputId="secondaryWord"
        label="Secondary"
        divClass="col-md-6 col-xs-12"
        v-model="wordData.secondWordValue"
        :dataValue="wordData.secondWordValue"
      ></app-input>
    </div>
    <button
      class="btn btn-primary btn-md"
      @click="wordData._id != undefined ? updateWord() : saveWord()"
    >
      <span>
        <i class="fas fa-plus"></i>
      </span>
      Save
    </button>
    <div class="table-responsive">
      <table class="table table-sm">
        <thead>
          <tr>
            <th scope="col">Main</th>
            <th scope="col">Secondary</th>
            <th scope="col">MainAF</th>
            <th scope="col">SecondaryAF</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="word in words" :key="word._id">
            <td>{{ word.firstWordValue }}</td>
            <td>{{ word.secondWordValue }}</td>
            <td>{{ word.firstWordAF }}</td>
            <td>{{ word.secondWordAF }}</td>
            <td>
              <button
                class="btn btn-success"
                @click="editButtonClick(word._id)"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Input from "../../components/Input.vue";
export default {
  data() {
    return {
      selectedPack: "",
      packComboboxData: [],
      words: [],
      wordData: {
        firstWordValue: null,
        firstWordAF: null,
        secondWordValue: null,
        secondWordAF: null
      }
    };
  },
  components: {
    "app-input": Input
  },
  methods: {
    packComboboxChange: async function(event) {
      console.log(this.selectedPack);
      if (this.selectedPack == "") this.selectedPack = event.target.value;
      await axios
        .get("http://localhost:5000/api/pack/" + this.selectedPack + "/words", {
          headers: {
            Authorization: `Bearer: ${this.$store.state.token}`
          }
        })
        .then(response => {
          this.words = response.data.data[0].words;
        })
        .catch(e => console.log(e));
    },
    editButtonClick: async function(wordId) {
      await axios
        .get(
          "http://localhost:5000/api/pack/" +
            this.selectedPack +
            "/words/" +
            wordId,
          {
            headers: {
              Authorization: `Bearer: ${this.$store.state.token}`
            }
          }
        )
        .then(response => {
          this.wordData = response.data.data[0];
        })
        .catch(e => console.log(e));
    },
    saveWord: async function() {
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
          this.packComboboxChange(this.selectedPack);
        })
        .catch(e => console.log(e));
    },
    updateWord: async function() {
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
          this.packComboboxChange(this.selectedPack);
        })
        .catch(e => console.log(e));
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

<style scoped></style>
