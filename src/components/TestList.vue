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
        />
        &nbsp;
        <b-button
          title="Shared this pack"
          class="listDeleteButton"
          type="is-text"
          icon-right="share"
        />
        &nbsp;

        <b-button
          title="Delete this pack"
          class="listDeleteButton"
          type="is-text"
          icon-right="delete"
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
        description: { title: "Description", display: true },
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
  },
};
</script>