<style scoped>
</style>
<template>
  <div>
    <div class="columns">
      <div class="column is-8">
        <word-page></word-page>
      </div>
      <div class="column is-4">
        <pack-page></pack-page>
      </div>
    </div>
  </div>
</template>
<script>
import PackPage from "./pack/Add.vue";
import WordPage from "./word/Add.vue";

export default {
  data() {
    return {};
  },
  components: {
    "pack-page": PackPage,
    "word-page": WordPage,
  },
};
</script>