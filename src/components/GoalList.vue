<template>
  <div class="goal-list">
    <h3 class="goal-list-header">{{ title }}</h3>
    <div class="goal-list-body">
      <div v-for="goal in filteredGoals" v-bind:key="goal._id">
        <goal-display :goal="goal" />
      </div>
    </div>
    <div class="goal-list-footer">
      <button
        class="pure-button pure-button-primary create-goal-btn"
        @click="clickCreate"
      >
        <i class="fas fa-plus"></i>
        Create goal
      </button>
    </div>
  </div>
</template>

<script>
import GoalDisplay from "@/components/GoalDisplay.vue";

const typeTitleMap = {
  daily: "Today's goals",
  weekly: "This week's goals",
  monthly: "Goals for the month",
  long: "Long term goals"
};

export default {
  name: "GoalList",
  props: ["goalType"],
  components: {
    GoalDisplay
  },
  computed: {
    filteredGoals() {
      return this.$store.state.goals.value.filter(g => {
        return g.type === this.goalType;
      });
    },
    title() {
      return typeTitleMap[this.goalType];
    }
  },
  methods: {
    clickCreate() {
      this.$emit("showModal", this.goalType);
    }
  }
};
</script>

<style scoped>
.goal-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 20vw;
  padding: 0 10px;
}
.goal-list-header {
  text-align: center;
}
.goal-list-body {
  /* height: 100%; */
  border: 1px solid #bfbfbd;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  margin-bottom: 10px;
}
.goal-list-footer {
  text-align: center;
}
</style>
