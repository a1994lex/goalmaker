<template>
  <div v-if="!register">
    <h1>Welcome to Goalmaker!</h1>
    <form @submit.prevent="login" class="pure-form pure-form-aligned">
      <fieldset>
        <div class="pure-control-group">
          <label for="username">Username</label>
          <input v-model="username" type="text" placeholder="Username" />
        </div>

        <div class="pure-control-group">
          <label for="password">Password</label>
          <input v-model="password" type="password" placeholder="Password" />
        </div>

        <div class="buttons-line">
          <button @click="toggleRegister" class="pure-button button-secondary">
            Register
          </button>
          <button type="submit" class="pure-button pure-button-primary">
            Login
          </button>
        </div>
      </fieldset>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
  <div v-else>
    <span class="back-arrow" @click="toggleRegister"
      ><i class="fas fa-arrow-left"></i
    ></span>
    <register />
  </div>
</template>

<script>
import Register from "@/components/Register.vue";
export default {
  name: "login",
  components: {
    Register
  },
  data() {
    return {
      username: "",
      password: "",
      error: "",
      register: false
    };
  },
  methods: {
    toggleRegister() {
      this.register = !this.register;
    },
    async login() {
      try {
        this.error = await this.$store.dispatch("login", {
          username: this.username,
          password: this.password
        });
        if (this.error === "") this.$router.push("mypage");
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

.back-arrow {
  position: absolute;
  top: 0;
  left: 0;
  margin: 20px;
  cursor: pointer;
  font-size: 2rem;
}
.buttons-line {
  float:right;
}
.buttons-line button {
  margin-left: 20px;
}
input {
  background-color: #e6e6e6;
  color: #2d3e50;
}

.back-arrow:hover {
  opacity: 0.3;
}

.pure-controls button {
  margin-left: auto;
}
</style>
