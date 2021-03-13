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
    <loading></loading>
  </div>
</template>

<script>
import axiosService from "../../helpers/axiosHelper.js";
import Loading from "../../components/Loading.vue";
import { basicAlertSwal } from "../../helpers/alertHelper.js";

export default {
  data() {
    return {
      packs: [],
    };
  },
  components: {
    loading: Loading,
  },
  methods: {
    addToMyPackages: async function (packId) {
      await axiosService
        .post("/pack/packCopy", { packId: packId })
        .then((response) => {
          response;
          basicAlertSwal("Pack Added");
          this.refreshList();
        })
        .catch((e) => console.log(e));
    },
    refreshList: function () {
      axiosService
        .get("/pack/getAllSharedPacks")
        .then((response) => {
          this.packs = response.data.data;
        })
        .catch((e) => console.log(e));
    },
  },
  mounted() {
    this.refreshList();
  },
};
</script>
