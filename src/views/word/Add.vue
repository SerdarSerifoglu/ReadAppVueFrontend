<template>
  <div>
    <select class="form-control col-md-4" @change="packComboboxChange($event)">
      <option
        v-for="item in packComboboxData"
        :value="item._id"
        :key="item._id"
        >{{ item.title }}</option
      >
    </select>
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
export default {
  data() {
    return {
      packComboboxData: [],
      words: []
    };
  },
  methods: {
    packComboboxChange: async function(event) {
      await axios
        .get(
          "http://localhost:5000/api/pack/" + event.target.value + "/words",
          {
            headers: {
              Authorization: `Bearer: ${this.$store.state.token}`
            }
          }
        )
        .then(response => {
          this.words = response.data.data[0].words;
        })
        .catch(e => console.log(e));
    },
    editButtonClick: async function(val) {
      return await console.log(val);
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
