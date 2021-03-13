<template>
  <div class="form-group">
    <div :class="divClass">
      <label>{{ label }}</label>
      <input
        v-bind:value="dataValue"
        v-on:input="$emit('input', $event.target.value)"
        :type="typeName"
        :class="inputClass"
        :id="inputId"
        :ref="childRef"
      />
      <small class="text-danger" v-if="!attention1">{{ attention1Text }}</small>
      <small class="text-danger" v-if="!attention2">{{ attention2Text }}</small>
      <small class="text-danger" v-if="!attention3">{{ attention3Text }}</small>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    childRef: {
      type: String,
    },
    dataValue: {
      type: String,
    },
    divClass: {
      type: String,
      default: "col-xs-12",
    },
    inputClass: {
      type: Object,
    },
    label: {
      type: String,
    },
    typeName: {
      type: String,
      default: "text",
    },
    inputId: {
      type: String,
    },
    attention1: {
      type: Boolean,
      default: true,
    },
    attention1Text: {
      type: String,
    },
    attention2: {
      type: Boolean,
      default: true,
    },
    attention2Text: {
      type: String,
    },
    attention3: {
      type: Boolean,
      default: true,
    },
    attention3Text: {
      type: String,
    },
  },
};
</script>
