<style scoped>
  .btnSuccess {
    color: #fff;
    background-color: #28a745;
    border-color: #28a745;
  }
  .btnDanger {
    color: #fff;
    background-color: #dc3545;
    border-color: #dc3545;
  }
  th,
  td {
    text-align: center;
  }
</style>
<template>
  <div class="packAdd">
    <button type="button" class="btn btn-primary" @click="addNewPackButtonClick()">
      Add New Pack
    </button>
    <div class="table-responsive">
      <table class="table table-sm">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Description</th>
            <th scope="col">Share Status</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pack in packs" :key="pack._id">
            <td>{{ pack.title }}</td>
            <td>{{ pack.description }}</td>
            <td>
              <button
                class="btn btn-sm"
                v-bind:class="{
                  btnSuccess: !pack.isShared,
                  btnDanger: pack.isShared,
                }"
                v-text="pack.isShared ? sharedButtonTextShareCancel : sharedButtonTextShare"
                @click="shareButtonClick(pack._id)"
              ></button>
            </td>
            <td>
              <button
                class="btn btn-sm btn-success"
                @click="editButtonClick(pack._id, pack.title, pack.description)"
                data-toggle="modal"
                data-target=".bd-example-modal-sm"
              >
                Edit
              </button>
              <span> | </span>
              <button class="btn btn-sm btn-danger" @click="deleteButtonClick(pack._id)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->

    <div
      class="modal fade bd-example-modal-sm"
      tabindex="-1"
      role="dialog"
      aria-labelledby="mySmallModalLabel"
      aria-hidden="true"
      v-bind:class="{
        show: modalDisplay,
      }"
      v-bind:style="{
        display: modalDisplayValue,
      }"
    >
      <div class="modal-dialog" id="addPackModal">
        <div class="modal-content">
          <div style="margin: 2rem">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Save Pack</h5>
              <button
                type="button"
                @click="modalClick()"
                style="border: 0;padding: 3px;background-color:#fff; cursor: pointer;"
              >
                <span>X</span>
              </button>
            </div>
            <div class="modal-body">
              <app-input
                @input="$v.packData.title.$touch()"
                :inputClass="{
                  'form-control': true,
                  'is-invalid': $v.packData.title.$error,
                }"
                inputId="title"
                label="Title"
                divClass="col-md-12 col-xs-12"
                v-model="packData.title"
                :dataValue="packData.title"
                :attention1="$v.packData.title.required"
                attention1Text="Title is required !"
              ></app-input>
              <app-input
                @input="$v.packData.description.$touch()"
                :inputClass="{
                  'form-control': true,
                  'is-invalid': $v.packData.description.$error,
                }"
                inputId="description"
                label="Description"
                divClass="col-md-12 col-xs-12"
                v-model="packData.description"
                :dataValue="packData.description"
                :attention1="$v.packData.description.required"
                attention1Text="Description is required !"
              ></app-input>
            </div>
            <div class="modal-footer">
              <button class="btn btn-success center" @click="insertOrUpdateWord()" :disabled="$v.packData.$invalid">
                <i class="far fa-save" style="margin-right:3px;"></i> SAVE
              </button>
              <button class="btn btn-danger center" @click="modalClick()">
                <i class="far fa-window-close" style="margin-right:3px;"></i> Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal End -->
  </div>
</template>

<script>
  import axios from "axios";
  import { required } from "vuelidate/lib/validators";
  import Input from "../../components/Input";

  export default {
    data() {
      return {
        modalDisplayValue: "none",
        modalDisplay: false,
        sharedButtonTextShare: "Share",
        sharedButtonTextShareCancel: "Share Cancel",
        packData: {
          title: "",
          description: "",
        },
        packs: [],
      };
    },
    validations: {
      packData: {
        title: { required },
        description: { required },
      },
    },
    name: "PackAdd",
    components: {
      "app-input": Input,
    },
    methods: {
      modalClick: function() {
        this.modalDisplay = !this.modalDisplay;
        if (this.modalDisplay) {
          this.modalDisplayValue = "block";
        } else {
          this.modalDisplayValue = "none";
        }
      },
      insertOrUpdateWord: async function() {
        //işlem uygulanıcak data varsa update yoksa add
        if (this.packData._id === undefined) {
          await axios
            .post("/pack/add/", { ...this.packData })
            .then((response) => {
              console.log(response);
              alert("Pack added");
            })
            .catch((e) => console.log(e));
        } else {
          await axios
            .put("/pack/" + this.packData._id, { ...this.packData })
            .then((response) => {
              console.log(response);
              alert("Pack updated");
            })
            .catch((e) => console.log(e));
        }
        this.packData = {};
      },
      async addNewPackButtonClick() {
        this.packData = {};
        this.modalClick();
      },
      async shareButtonClick(packId) {
        await axios
          .put("/pack/" + packId + "/shared", {})
          .then((response) => {
            this.refreshList();
            console.log(response);
            // this.packComboboxChange(this.selectedPack);
          })
          .catch((e) => console.log(e));
      },
      editButtonClick: async function(packId, packTitle, packDescription) {
        this.packData._id = packId;
        this.packData.title = packTitle;
        this.packData.description = packDescription;
        this.modalClick();
      },
      deleteButtonClick: async function(packId) {
        await axios
          .delete("/pack/" + packId)
          .then((response) => {
            response;
            this.refreshList();
          })
          .catch((e) => console.log(e));
      },
      async refreshList() {
        await axios
          .get("/pack/getAllUsersPacks")
          .then((response) => {
            this.packs = response.data.data;
          })
          .catch((e) => console.log(e));
      },
    },
    async created() {
      axios.defaults.baseURL = process.env.VUE_APP_BASE_PATH;
      axios.defaults.headers.common["Authorization"] = `Bearer: ${this.$store.state.token}`;
      await this.refreshList();
    },
  };
</script>
