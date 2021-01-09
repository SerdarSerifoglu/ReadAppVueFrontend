<style scoped>
th,
td {
  text-align: center;
}
</style>
<template>
  <div class="table-responsive">
    <table class="table table-sm">
      <thead>
        <tr>
          <th scope="col">Title</th>
          <th scope="col">Description</th>
          <th scope="col">Copy Count</th>
          <th scope="col">Add To My Packages</th>
          <!-- <th scope="col">Edit</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="pack in packs" :key="pack._id">
          <td>{{ pack.title }}</td>
          <td>{{ pack.description }}</td>
          <td>{{ pack.copyCount }}</td>
          <td>
            <button
              class="btn btn-sm btn-danger"
              @click="addToMyPackages(pack._id)"
            >
              Add
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      packs: [],
    };
  },
  async created() {
    await axios
      .get("http://localhost:5000/api/pack/getAllSharedPacks", {
        headers: {
          Authorization: `Bearer: ${this.$store.state.token}`,
        },
      })
      .then((response) => {
        this.packs = response.data.data;
      })
      .catch((e) => console.log(e));
  },
  methods: {
    addToMyPackages: async function (packId) {
      await axios
        .post(
          "http://localhost:5000/api/pack/packCopy",
          { packId: packId },
          {
            headers: {
              Authorization: `Bearer: ${this.$store.state.token}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          alert("That pack added you packeges.");
        })
        .catch((e) => console.log(e));
    },
  },
};
</script>