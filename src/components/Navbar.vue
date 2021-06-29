<style scoped>
.logoNavbar {
  width: 250px;
  height: 50px;
  background-image: url("../assets/Hardworder-Logo-beyaz-kırmizi.svg");
  background-repeat: no-repeat;
  background-position: center;
}
form {
  margin-block-end: 0em;
}
.navbar-dark .navbar-nav .nav-link,
#dropdown05 {
  color: #ffa026;
}

.navbar-dark .navbar-nav .nav-link:hover {
  color: #ffffff;
}
.navbar-dark .navbar-nav .nav-link:focus {
  color: #ffffff;
}
.dropdown-item:hover {
  background-color: #ffa026;
}
.dropdown-menu {
  background-color: #fcf1e3;
}
.navbarUsername {
  color: #ffa026;
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
  computed: {
    userLoggedIn() {
      return this.$store.state.userData.access_token != "";
    },
  },
};
</script>
<template>
  <div id="nav">
    <nav
      class="navbar navbar-expand-lg navbar-dark bg-dark"
      aria-label="Fifth navbar example"
    >
      <div class="container-fluid">
        <div class="logoNavbar"></div>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarsExample05"
          aria-controls="navbarsExample05"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarsExample05">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item" v-if="!userLoggedIn">
              <router-link class="nav-link" to="/register"
                >Register</router-link
              >
            </li>
            <li class="nav-item" v-if="!userLoggedIn">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item" v-if="userLoggedIn">
              <router-link class="nav-link" to="/reader">Reader</router-link>
            </li>
            <li class="nav-item" v-if="userLoggedIn">
              <router-link class="nav-link" to="/pack">My Packs</router-link>
            </li>
            <li class="nav-item" v-if="userLoggedIn">
              <router-link class="nav-link" to="/words">Words</router-link>
            </li>
            <!-- <li class="nav-item" v-if="this.$store.state.token != ''">
              <router-link class="nav-link" to="/packword"
                >PackWord</router-link
              >
            </li> -->
            <li class="nav-item" v-if="userLoggedIn">
              <router-link class="nav-link" to="/sharedPacks"
                >Shared Packs</router-link
              >
            </li>
          </ul>
          <div v-if="userLoggedIn" class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="dropdown05"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              >Username Dropdown</a
            >
            <ul class="dropdown-menu" aria-labelledby="dropdown05">
              <li>
                <router-link class="dropdown-item" to="/userSettings"
                  >User Settings</router-link
                >
              </li>
              <li>
                <a class="dropdown-item" @click.prevent="logout" href=""
                  >Logout</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>
