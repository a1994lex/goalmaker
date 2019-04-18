<template>
  <div class="home">
    <div v-if="loading">
      <loader />
    </div>
    <div class="message" v-else-if="goals.length === 0">
      Hey {{ user.name }}! Looks like you don't have any goals yet. Click on
      Create Goal!
      <button
        class="pure-button pure-button-primary create-goal-btn"
        @click="toggleModal"
      >
        <i class="fas fa-plus"></i>
        Create goal
      </button>
    </div>
    <div v-else class="goal-lists">
      <div v-for="goalType in goalTypes" v-bind:key="goalType">
        <goal-list :goalType="goalType" @showModal="toggleModal" />
      </div>
    </div>

    <goal-form
      :show="showModal"
      @escape="escape"
      @formFinished="formFinished"
    />
    <escape-event @escape="escape" />
  </div>
</template>

<script>
import EscapeEvent from "@/components/EscapeEvent.vue";
import GoalForm from "@/components/GoalForm.vue";
import Loader from "@/components/Loader.vue";
import GoalList from "@/components/GoalList.vue";

export default {
  components: {
    EscapeEvent,
    GoalForm,
    GoalList,
    Loader
  },
  data() {
    return {
      showModal: false,
      goalType: "",
      goalTypes: ["daily", "weekly", "monthly", "long"]
    };
  },
  computed: {
    user() {
      return this.$store.state.user.value;
    },
    loading() {
      return this.$store.state.goals.loading;
    },
    goals() {
      return this.$store.state.goals.value;
    }
  },
  methods: {
    toggleModal(type) {
      this.showModal = true;
      this.$store.dispatch("setCurrentGoalFormType", type);
    },
    escape() {
      this.showModal = null;
    },
    async formFinished() {
      this.showModal = null;
      try {
        await this.$store.dispatch("getGoals");
      } catch (e) {
        console.log(e);
      }
    }
  },
  async created() {
    await this.$store.dispatch("getUser");
    if (this.$store.state.user.value) {
      await this.$store.dispatch("getGoals");
    }
  }
};
</script>

<style scoped>
.message {
  text-align: center;
  font-size: 2rem;
}
.goal-lists {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  height: 100%;
}
.create-goal-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 20px;
}
.home {
  height: 100%;
}
</style>
