<style scoped>
textarea:focus,
input:focus {
  outline: none;
}
.pack-add-div {
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%;
  margin: 30px auto;
  padding: 20px 30px;
  -webkit-box-shadow: 5px 6px 17px 0px rgba(0, 0, 0, 0.68);
  -moz-box-shadow: 5px 6px 17px 0px rgba(0, 0, 0, 0.68);
  box-shadow: 5px 6px 17px 0px rgba(0, 0, 0, 0.68);
  border-radius: 10px;
}
.pack-add-div .pack-add-title {
  align-self: flex-start;
  font-size: 2rem;
  font-weight: 100;
}
.pack-add-div .pack-add-text {
  width: 60%;
  height: 40px;
  border: 1px solid gray;
  border-radius: 15px;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 20px;
}
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

@media only screen and (max-width: 768px) {
  .pack-add-div {
    /* position: fixed; */
    /* z-index: 999; */
    width: 100%;
    margin-top: 0;
    margin-bottom: 0;
    flex-direction: row;
    padding: 10px 0;
    align-items: center;
    justify-content: center;
    border-radius: 0;
    box-shadow: none;
    border-bottom: 1px solid gray;
  }
  .pack-add-title {
    display: none;
  }
  .pack-add-div .pack-add-text {
    margin: 0 20px;
  }
}
</style>
<template>
  <div class="packAdd">
    <div class="pack-add-div">
      <h2 class="pack-add-title">Add Pack</h2>
      <input class="pack-add-text" type="text" placeholder="Add a new pack" />

      <button
        type="button"
        class="btn btn-primary"
        @click="addNewPackButtonClick()"
      >
        Add New Pack
      </button>
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
                style="
                  border: 0;
                  padding: 3px;
                  background-color: #fff;
                  cursor: pointer;
                "
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
              <button
                class="btn btn-success center"
                @click="insertOrUpdatePack()"
                :disabled="$v.packData.$invalid"
              >
                <i class="far fa-save" style="margin-right: 3px"></i> SAVE
              </button>
              <button class="btn btn-danger center" @click="modalClick()">
                <i class="far fa-window-close" style="margin-right: 3px"></i>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal End -->
    <pack-list
      @editClick="editButtonClick($event.id, $event.title, $event.description)"
      @shareClick="shareButtonClick($event.id, $event.isShared)"
      @deleteClick="deleteButtonClick($event)"
      :listData="packs"
    ></pack-list>
    <loading></loading>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import Input from "../../components/Input";
import { basicAlertSwal } from "../../helpers/alertHelper.js";
import PackList from "../../components/PackList.vue";
import Loading from "../../components/Loading.vue";
import axiosService from "../../helpers/axiosHelper.js";

export default {
  data() {
    return {
      modalDisplayValue: "none",
      modalDisplay: false,
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
    "pack-list": PackList,
    loading: Loading,
  },
  methods: {
    modalClick: function () {
      this.modalDisplay = !this.modalDisplay;
      this.packData = { ...this.packData };
      if (this.modalDisplay) {
        this.modalDisplayValue = "block";
      } else {
        this.modalDisplayValue = "none";
      }
    },
    insertOrUpdatePack: async function () {
      //işlem uygulanıcak data varsa update yoksa add
      if (this.packData._id === undefined) {
        await axiosService
          .post("/pack/add/", { ...this.packData })
          .then((response) => {
            basicAlertSwal("Pack added");
            console.log(response);
            this.refreshList();
            this.modalClick();
          })
          .catch((e) => {
            basicAlertSwal(`Error - ${e}`, "error");
          });
      } else {
        await axiosService
          .put("/pack/" + this.packData._id, { ...this.packData })
          .then((response) => {
            console.log(response);
            basicAlertSwal("Pack updated");
            this.refreshList();
            this.modalClick();
          })
          .catch((e) => {
            basicAlertSwal(`Error - ${e}`, "error");
          });
      }
      this.packData = {};
    },
    async addNewPackButtonClick() {
      this.packData = {};
      this.modalClick();
    },
    async shareButtonClick(packId, packIsShared) {
      await axiosService
        .put("/pack/" + packId + "/shared", {})
        .then((response) => {
          this.refreshList();
          console.log(response);
          basicAlertSwal(
            packIsShared == true ? "Pack closed to share" : "Pack shared"
          );
        })
        .catch((e) => console.log(e));
    },
    editButtonClick: async function (packId, packTitle, packDescription) {
      this.packData._id = packId;
      this.packData.title = packTitle;
      this.packData.description = packDescription;
      this.modalClick();
    },
    deleteButtonClick: async function (packId) {
      await axiosService
        .delete("/pack/" + packId)
        .then((response) => {
          response;
          this.refreshList();
          basicAlertSwal("Deleted pack");
        })
        .catch((e) => console.log(e));
    },
    async refreshList() {
      await axiosService
        .get("/pack/getAllUsersPacks")
        .then((response) => {
          this.packs = response.data.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  async created() {
    await this.refreshList();
  },
};
</script>
