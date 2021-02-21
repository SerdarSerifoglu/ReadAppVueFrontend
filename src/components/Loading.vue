<template>
  <b-loading
    :is-full-page="fullPage"
    v-model="this.$store.getters.getLoadingStatus"
    :can-cancel="true"
  ></b-loading>
</template>

<script>
export default {
  data() {
    return {
      fullPage: true,
    };
  },
};
</script>