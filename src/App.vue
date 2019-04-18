<template>
  <div id="app">
    <div v-if="loading" style="height: 100vh;">
      <loader />
    </div>
    <div v-else-if="user === null" class="login">
      <div class="centered">
        <login />
      </div>
    </div>
    <div id="page" v-else>
      <div class="pure-menu-horizontal">
        <span class="pure-menu-heading"
          ><i class="fas fa-clock"></i>Goal Maker</span
        >
        <ul class="pure-menu-list">
          <li class="pure-menu-item">
            <router-link to="/" class="pure-menu-link">My Goals</router-link>
          </li>
          <li class="pure-menu-item">
            <router-link to="/mypage" class="pure-menu-link"
              >Team Goals</router-link
            >
          </li>
          <li class="pure-menu-item">
            <a class="pure-menu-link" @click="logout">
              <i class="fas fa-sign-out-alt"></i>
            </a>
          </li>
        </ul>
      </div>
      <div class="content">
        <div class="content-padding">
          <router-view />
        </div>
        <div class="footer">
          <a href="https://github.com/a1994lex/goal-tracker"
            >View the source code</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Login from "@/components/Login.vue";
import Loader from "@/components/Loader.vue";
export default {
  components: {
    Login,
    Loader
  },
  computed: {
    user() {
      return this.$store.state.user.value;
    },
    loading() {
      return this.$store.state.user.loading;
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch("logout");
    }
  },
  async created() {
    await this.$store.dispatch("getUser");
  }
};
</script>

<style>
/* https://color.adobe.com/Ventana-Azul-color-theme-2159606/?showPublished=true */
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 18px;
  /* display: flex; */
  min-height: 100%;
  color: #40403f;
}

body {
  color: #7f8c8d;
  display: block;
  margin: 0;
}

*:before,
*:after {
  box-sizing: border-box;
  /* https://css-tricks.com/box-sizing/ */
}

#page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.centered {
  margin: 20% auto;
  width: 65%;
}

.pure-menu-horizontal {
  /* To limit the menu width to the content of the menu: */
  /* display: inline-block; */
  /* Or set the width explicitly: */
  /* text-align: left; */
  display: flex;
  justify-content: space-between;
  background-color: #2d3e50;
}

.pure-menu-heading {
  color: #fff;
  font-size: 1.4em;
  padding: 20px 20px;
  margin-right: 10px;
}
.pure-menu-heading svg {
  padding-right: 10px;
}

.pure-menu-link {
  color: #fff;
  opacity: 0.6;
  background-color: transparent;
  padding: 20px 10px;
  font-weight: 800;
  line-height: 1.5rem;
}
.pure-menu-link svg {
  font-size: 1.6rem;
}

.pure-menu-link:hover {
  background-color: transparent;
  opacity: 0.3;
}

.pure-menu-link.router-link-exact-active {
  background-color: transparent;
  color: white;
  opacity: 1;
  font-size: 1.5rem;
}

.footer {
  text-align: center;
  width: 100%;
  padding: 12px 0px;
  background-color: #111;
}

.footer a {
  text-decoration: none;
  color: #7f8c8d;
  font-size: 1.1rem;
}

.footer a:hover {
  opacity: 0.5;
}

.content {
  flex: 1;
  display: flex;
  height: 100vh;
  flex-direction: column;
}

.content-padding {
  overflow: auto;
  position: relative;
  padding: 50px 100px;
  flex: 1;
}

.error {
  color: #f2385a;
}

.pure-button-primary {
  background-color: #36b1bf;
}

/* Modals */
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 500px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h1 {
  margin-bottom: 30px;
  font-size: 1.5em;
}

.modal-body {
  margin: 0;
}

.modal-body input {
  margin-bottom: 20px;
  height: 30px;
}

.modal-footer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.modal-default-button {
  float: right;
}

/*
  * The following styles are auto-applied to elements with
  * transition="modal" when their visibility is toggled
  * by Vue.js.
  *
  * You can easily play with the modal transition by editing
  * these styles.
  */
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
