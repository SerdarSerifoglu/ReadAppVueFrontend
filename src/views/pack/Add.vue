<template>
  <div class="packAdd">
    <app-input
      inputId="title"
      label="Title"
      divClass="col-md-6 col-xs-12"
      v-model="packData.title"
    ></app-input>
    <app-input
      inputId="description"
      label="Description"
      divClass="col-md-6 col-xs-12"
      v-model="packData.description"
    ></app-input>
    <button class="btn btn-primary col-md-3 col-xs-12" @click="add">ADD</button>
  </div>
</template>

<script>
import axios from "axios";
import Input from "../../components/Input";
export default {
  data() {
    return {
      packData: {
        title: "",
        description: "",
      },
    };
  },
  name: "PackAdd",
  components: {
    "app-input": Input,
  },
  methods: {
    async add() {
      await axios
        .post(
          "http://localhost:5000/api/pack/add",
          { ...this.packData },
          {
            headers: {
              Authorization: `Bearer: ${this.$store.state.token}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
        })
        .catch((e) => console.log(e));
    },
  },
};
</script>
