<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
export default {
  components: {
    Navbar
  },
  created() {
    this.$store.dispatch("initAuth");
  }
};
</script>

<style></style>
