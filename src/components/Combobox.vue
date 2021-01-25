<template>
  <div :class="classValue">
    <select
      class="form-control"
      v-model="selectedValue"
      @change="sendSelectedValue()"
    >
      <option v-for="item in mainData" :value="item._id" :key="item._id">
        {{ item.title }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedValue: "",
    };
  },
  props: {
    classValue: {
      type: String,
      default: "col-xs-12",
    },
    mainData: {
      type: Array,
    },
    currentValue: {
      type: String,
    },
  },
  methods: {
    sendSelectedValue() {
      this.$emit("comboboxChange", this.selectedValue);
    },
  },
  mounted() {
    if (this.selectedValue == "") {
      this.selectedValue = this.currentValue;
    }
  },
};
</script>
