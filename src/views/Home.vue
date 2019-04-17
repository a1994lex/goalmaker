<template>
  <div class="home">
    <div class="center" v-if="user === null">
      <router-link to="/register" class="pure-button">Register</router-link> or
      <router-link to="/login" class="pure-button">Login</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  components: {},
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  async created() {
    await this.$store.dispatch("getUser");
  }
};
</script>

<style>
.empty-msg {
  font-size: 3rem;
}
.center {
  text-align: center;
}
</style>
