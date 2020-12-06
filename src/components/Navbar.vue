<style scoped>
.logoNavbar {
  width: 250px;
  height: 50px;
  background-image: url("../assets/HardworderSWG.svg");
  background-repeat: no-repeat;
  background-position: center;
}
</style>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      overlayClassName: "overlay",
    };
  },
  methods: {
    overlayActive: function () {
      this.overlayClassName = "overlay overlay--active";
    },
    overlayClose: function () {
      this.overlayClassName = "overlay";
    },
    logout: function () {
      this.$store.dispatch("logout");
    },
  },
};
</script>
<template>
  <div id="nav">
    <header>
      <div class="logoNavbar"></div>
      <nav>
        <div class="nav__links">
          <div class="nav-item" v-if="this.$store.state.token == ''">
            <router-link class="nav-item" to="/register">Register</router-link>
          </div>
          <div class="nav-item" v-if="this.$store.state.token == ''">
            <router-link class="nav-item" to="/login">Login</router-link>
          </div>
          <div class="nav-item" v-if="this.$store.state.token != ''">
            <router-link class="nav-item" to="/treng/edit">TrEng</router-link>
          </div>
          <div class="nav-item" v-if="this.$store.state.token != ''">
            <router-link class="nav-item" to="/reader">Reader</router-link>
          </div>
          <div class="nav-item" v-if="this.$store.state.token != ''">
            <router-link class="nav-item" to="/pack">Packs</router-link>
          </div>
          <div class="nav-item" v-if="this.$store.state.token != ''">
            <router-link class="nav-item" to="/test">Test</router-link>
          </div>
        </div>
      </nav>
      <a class="cta" @click.prevent="logout" href="#">Logout</a>
      <p class="menu cta" @click="overlayActive">Menu</p>
    </header>
    <div :class="overlayClassName">
      <a class="close" @click="overlayClose">&times;</a>
      <div class="overlay__content">
        <div
          @click="overlayClose"
          class="nav-item"
          v-if="this.$store.state.token == ''"
        >
          <router-link class="nav-item" to="/register">Register</router-link>
        </div>
        <div
          @click="overlayClose"
          class="nav-item"
          v-if="this.$store.state.token == ''"
        >
          <router-link class="nav-item" to="/login">Login</router-link>
        </div>
        <div
          @click="overlayClose"
          class="nav-item"
          v-if="this.$store.state.token != ''"
        >
          <router-link class="nav-item" to="/treng/edit">TrEng</router-link>
        </div>
        <div
          @click="overlayClose"
          class="nav-item"
          v-if="this.$store.state.token != ''"
        >
          <router-link class="nav-item" to="/reader">Reader</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
