<template>
  <div>
    <h1>Register for an account</h1>
    <form @submit.prevent="register" class="pure-form pure-form-aligned">
      <fieldset>
        <div class="pure-control-group">
          <label for="name">Full Name</label>
          <input v-model="name" type="text" placeholder="Full Name" />
        </div>

        <div class="pure-control-group">
          <label for="username">Username</label>
          <input v-model="username" type="text" placeholder="Username" />
        </div>

        <div class="pure-control-group">
          <label for="password">Password</label>
          <input v-model="password" type="password" placeholder="Password" />
        </div>

        <div class="pure-controls">
          <button type="submit" class="pure-button pure-button-primary">
            Submit
          </button>
        </div>
      </fieldset>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: "register",
  data() {
    return {
      name: "",
      username: "",
      password: "",
      error: ""
    };
  },
  methods: {
    async register() {
      try {
        this.error = await this.$store.dispatch("register", {
          name: this.name,
          username: this.username,
          password: this.password
        });
        if (this.error === "") this.$router.push("/");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style scoped>
form {
  border: 1px solid #bfbfbd;
  background-color: #2d3e50;
  border-radius: 4px;
  color: #e6e6e6;
  padding: 20px;
}

.pure-controls {
  display: flex;
}
input {
  background-color: #e6e6e6;
  color: #2d3e50;
}

.pure-controls button {
  margin-left: auto;
}
</style>
