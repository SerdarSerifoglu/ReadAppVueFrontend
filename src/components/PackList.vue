<style scoped>
</style>

<template>
  <section>
    <b-table
      :data="listData"
      ref="table"
      :default-sort="['title', 'asc']"
      sort-icon="arrow-up"
      sort-icon-size="is-small"
    >
      <b-table-column
        field="title"
        :visible="columnsVisible['title'].display"
        :label="columnsVisible['title'].title"
        width="auto"
        sortable
        v-slot="props"
        searchable
      >
        {{ props.row.title }}
      </b-table-column>

      <b-table-column
        field="description"
        :visible="columnsVisible['description'].display"
        :label="columnsVisible['description'].title"
        sortable
        v-slot="props"
        searchable
      >
        {{ props.row.description }}
      </b-table-column>

      <b-table-column
        :visible="columnsVisible['cleared'].display"
        :label="columnsVisible['cleared'].title"
        centered
        v-slot="props"
      >
        <b-button
          title="Edit this pack"
          class="listEditButton"
          @click="
            editButtonClickList(
              props.row._id,
              props.row.title,
              props.row.description
            )
          "
          type="is-text"
          icon-right="pencil"
          size="is-small"
        />
        &nbsp;
        <b-button
          v-if="!props.row.isShared"
          title="Shared this pack"
          class="listShareButtonGreen"
          type="is-text"
          icon-right="share"
          size="is-small"
          @click="shareButtonClickInList(props.row._id, props.row.isShared)"
        />
        <b-button
          v-else
          title="Shared this pack"
          class="listShareButton"
          type="is-text"
          icon-right="cancel"
          size="is-small"
          @click="shareButtonClickInList(props.row._id, props.row.isShared)"
        />
        &nbsp;

        <b-button
          title="Delete this pack"
          class="listDeleteButton"
          type="is-text"
          icon-right="delete"
          size="is-small"
          @click="deleteButtonClickInList(props.row._id)"
        />
      </b-table-column>
    </b-table>
  </section>
</template>

<script>
// import axios from "axios";

export default {
  data() {
    return {
      data: [],
      columnsVisible: {
        title: { title: "Name", display: true },
        description: { title: "Description", display: false },
        cleared: { title: "Actions", display: true },
      },
      sortIcon: "arrow-up",
      sortIconSize: "is-small",
    };
  },
  props: ["listData"],
  methods: {
    editButtonClickList: function (id, title, description) {
      this.$emit("editClick", {
        id: id,
        title: title,
        description: description,
      });
    },
    shareButtonClickInList: function (id, isShared) {
      this.$emit("shareClick", {
        id: id,
        isShared: isShared,
      });
    },
    deleteButtonClickInList: function (id) {
      this.$emit("deleteClick", id);
    },
  },
};
</script>