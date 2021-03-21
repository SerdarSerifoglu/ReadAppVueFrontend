<style scoped>
th,
td {
  text-align: center;
}
.share-main-table {
  width: 70%;
  margin: 30px auto;
  -webkit-box-shadow: 5px 6px 17px 0px rgba(0, 0, 0, 0.68);
  -moz-box-shadow: 5px 6px 17px 0px rgba(0, 0, 0, 0.68);
  box-shadow: 5px 6px 17px 0px rgba(0, 0, 0, 0.68);
  border-radius: 10px;
  padding: 20px 30px;
  background-color: white;
}
.shared-text {
  align-self: flex-start;
  font-size: 2rem;
  font-weight: 100;
  margin-bottom: 10px;
}
.shared-table {
  border: 1px solid gray;
  border-radius: 10px;
}
@media only screen and (max-width: 768px) {
  .share-main-table {
    width: 100%;
    margin-top: 0;
    margin-bottom: 0;
    flex-direction: row;
    padding: 10px 0;
    align-items: center;
    justify-content: center;
    border-radius: 0;
    box-shadow: none;
  }
  .shared-text {
    display: none;
  }
  .shared-table {
    border: none;
  }
}
</style>

<template>
  <div class="table-responsive share-main-table">
    <h2 class="shared-text">Shared Packs</h2>
    <table class="table table-sm shared-table">
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
