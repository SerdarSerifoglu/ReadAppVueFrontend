<template>
  <div>
    <app-combobox
      :mainData="packComboboxData"
      @comboboxChange="packComboboxChange($event)"
    />
    <button class="btn btn-primary btn-md" @click="newWord()">
      <span>
        <i class="fas fa-plus"></i>
      </span>
      Add Word
    </button>
    <div class="addWord">
      <app-input
        inputId="mainWord"
        label="Main Word"
        divClass="col-md-6 col-xs-12"
        v-model="wordData.mainWord"
        :dataValue="wordData.mainWord"
      ></app-input>
      <app-input
        inputId="secondaryWord"
        label="Secondary Word"
        divClass="col-md-6 col-xs-12"
        v-model="wordData.secondaryWord"
        :dataValue="wordData.secondaryWord"
      ></app-input>
      <app-input
        inputId="mainWordAF"
        label="Main Word A.F."
        divClass="col-md-6 col-xs-12"
        v-model="wordData.mainWordAF"
        :dataValue="wordData.mainWordAF"
      ></app-input>
      <app-input
        inputId="secondaryWordAF"
        label="Secondary Word A.F."
        divClass="col-md-6 col-xs-12"
        v-model="wordData.secondaryWordAF"
        :dataValue="wordData.secondaryWordAF"
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
            <td>{{ word.mainWord }}</td>
            <td>{{ word.secondaryWord }}</td>
            <td>{{ word.mainWordAF }}</td>
            <td>{{ word.secondaryWordAF }}</td>
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
import Combobox from "../../components/Combobox.vue";
export default {
  data() {
    return {
      selectedPack: "",
      packComboboxData: [],
      words: [],
      wordData: {
        mainWord: null,
        mainWordAF: null,
        secondaryWord: null,
        secondaryWordAF: null,
      },
    };
  },
  components: {
    "app-input": Input,
    "app-combobox": Combobox,
  },
  methods: {
    packComboboxChange: async function (event) {
      this.selectedPack = event;
      await axios
        .get("http://localhost:5000/api/pack/" + this.selectedPack + "/words", {
          headers: {
            Authorization: `Bearer: ${this.$store.state.token}`,
          },
        })
        .then((response) => {
          this.words = response.data.data[0].words;
        })
        .catch((e) => console.log(e));
    },
    editButtonClick: async function (wordId) {
      await axios
        .get(
          "http://localhost:5000/api/pack/" +
            this.selectedPack +
            "/words/" +
            wordId,
          {
            headers: {
              Authorization: `Bearer: ${this.$store.state.token}`,
            },
          }
        )
        .then((response) => {
          this.wordData = response.data.data[0];
        })
        .catch((e) => console.log(e));
    },
    saveWord: async function () {
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
          this.packComboboxChange(this.selectedPack);
        })
        .catch((e) => console.log(e));
    },
    updateWord: async function () {
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
          this.packComboboxChange(this.selectedPack);
        })
        .catch((e) => console.log(e));
    },
    newWord: function () {
      this.wordData = {
        mainWord: null,
        mainWordAF: null,
        secondaryWord: null,
        secondaryWordAF: null,
      };
    },
  },
  async created() {
    await axios
      .get("http://localhost:5000/api/pack/forCbx", {
        headers: {
          Authorization: `Bearer: ${this.$store.state.token}`,
        },
      })
      .then((response) => {
        this.packComboboxData = response.data.data;
      })
      .catch((e) => console.log(e));
  },
};
</script>

<style scoped></style>
