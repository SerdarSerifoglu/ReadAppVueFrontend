<template>
  <section>
    <b-table
      :data="listData"
      ref="table"
      :default-sort="['mainWord', 'asc']"
      sort-icon="arrow-up"
      sort-icon-size="is-small"
    >
      <b-table-column
        field="mainWord"
        :visible="columnsVisible['mainWord'].display"
        :label="columnsVisible['mainWord'].title"
        width="auto"
        sortable
        v-slot="props"
        searchable
      >
        {{ props.row.mainWord }}
      </b-table-column>

      <b-table-column
        field="secondaryWord"
        :visible="columnsVisible['secondaryWord'].display"
        :label="columnsVisible['secondaryWord'].title"
        sortable
        v-slot="props"
        searchable
      >
        {{ props.row.secondaryWord }}
      </b-table-column>

      <b-table-column
        :visible="columnsVisible['actions'].display"
        :label="columnsVisible['actions'].title"
        centered
        v-slot="props"
      >
        <b-button
          title="Edit this pack"
          class="listEditButton"
          @click="
            editButtonClickList(
              props.row._id,
              props.row.mainWord,
              props.row.secondaryWord
            )
          "
          type="is-text"
          icon-right="pencil"
        />
        &nbsp;

        <b-button
          title="Delete this pack"
          class="listDeleteButton"
          type="is-text"
          icon-right="delete"
          @click="deleteButtonClickInList(props.row._id)"
        />
      </b-table-column>
    </b-table>
  </section>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      columnsVisible: {
        mainWord: { title: "Main Word", display: true },
        secondaryWord: { title: "Secondary Word", display: true },
        actions: { title: "Actions", display: true },
      },
      sortIcon: "arrow-up",
      sortIconSize: "is-small",
    };
  },
  props: ["listData"],
  methods: {
    editButtonClickList: function (id, mainWord, secondaryWord) {
      this.$emit("editClick", {
        id: id,
        mainWord: mainWord,
        secondaryWord: secondaryWord,
      });
    },
    deleteButtonClickInList: function (id) {
      this.$emit("deleteClick", id);
    },
  },
};
</script>