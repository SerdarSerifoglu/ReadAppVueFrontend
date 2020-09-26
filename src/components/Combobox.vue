<template>
  <div class="cbx">
    <select
      class="form-control col-md-4"
      v-model="selectedValue"
      @change="sendSelectedValue()"
    >
      <option v-for="item in mainData" :value="item._id" :key="item._id">{{
        item.title
      }}</option>
    </select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedValue: ""
    };
  },
  props: {
    mainData: {
      type: Array
    }
  },
  methods: {
    sendSelectedValue() {
      this.$emit("comboboxChange", this.selectedValue);
    }
  }
};
</script>
