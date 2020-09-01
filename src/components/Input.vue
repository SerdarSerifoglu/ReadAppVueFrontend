<template>
  <div :class="divClass" style="margin:10px;">
    <label>{{ label }}</label>
    <input
      v-bind:value="dataValue"
      v-on:input="$emit('input', $event.target.value)"
      :type="typeName"
      class="form-control"
      :id="inputId"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    dataValue: {
      type: String
    },
    divClass: {
      type: String,
      default: "col-xs-12"
    },
    label: {
      type: String
    },
    typeName: {
      type: String,
      default: "text"
    },
    inputId: {
      type: String
    },
    vModel: {
      type: String
    }
  }
};
</script>
