import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      value: null,
      loading: true
    },
    currentGoalFormType: null,
    goals: {
      value: [],
      loading: true
    },
    teamRefs: [],
    myTeams: []
  },
  getters: {
    teamGoals: state => {
      return state.goals.value.filter(goal => {
        if (goal.team) {
          return state.myTeams.includes(goal.team);
        }
        return false;
      });
    }
  },
  mutations: {
    setUser(state, user) {
      state.user.value = user;
      state.user.loading = false;
    },
    setGoals(state, goals) {
      state.goals.value = goals;
      state.goals.loading = false;
    },
    setGoal(state, goal) {
      let valIndex = state.goals.value.findIndex(g => g._id === goal._id);
      if (valIndex > -1) {
        state.goals.value[valIndex] = goal;
      }
    },
    setCurrentGoalFormType(state, goalType) {
      state.currentGoalFormType = goalType;
    },
    removeGoal(state, goalId) {
      let index = state.goals.value.findIndex(g => g._id === goalId);
      console.log(index);
      if (index > -1) {
        state.goals.value = state.goals.value.splice(index, 1);
      }
    }
  },
  actions: {
    setCurrentGoalFormType(context, id) {
      context.commit("setCurrentGoalFormType", id);
    },
    async register(context, data) {
      try {
        let response = await axios.post("/api/users", data);
        context.commit("setUser", response.data);
        return "";
      } catch (error) {
        return error.response.data.message;
      }
    },
    async login(context, data) {
      try {
        let response = await axios.post("/api/users/login", data);
        context.commit("setUser", response.data);
        return "";
      } catch (error) {
        return error.response.data.message;
      }
    },
    async logout(context) {
      try {
        await axios.delete("/api/users");
        context.commit("setUser", null);
        return "";
      } catch (error) {
        return error.response.data.message;
      }
    },
    async getUser(context) {
      try {
        if (this.state.user.value) return;
        this.state.user.loading = true;
        let response = await axios.get("/api/users");
        context.commit("setUser", response.data);
        this.state.user.loading = false;
        return "";
      } catch (error) {
        this.state.user.loading = false;
        return "";
      }
    },
    async getGoals(context) {
      try {
        this.state.goals.loading = true;
        let response = await axios.get("/api/goals");
        context.commit("setGoals", response.data);
        this.state.goals.loading = false;
      } catch (error) {
        return "Could not get goals";
      }
    },
    async updateGoal(context, data) {
      try {
        console.log(data);
        await axios.put(`/api/goals/${data.id}`, data);
      } catch (error) {
        return "";
      }
    },
    async deleteGoal(context, id) {
      try {
        await axios.delete(`/api/goals/${id}`);
        context.commit("removeGoal", id);
        context.dispatch("getGoals");
      } catch (e) {
        console.log(e);
        return "";
      }
    },
    async addGoal(context, data) {
      try {
        console.log(data);
        await axios.post("/api/goals", data);
      } catch (e) {
        console.log(e);
        return "";
      }
    },
    async checkOff(context, data) {
      await axios.put(`api/goals/${data.goalId}`, {
        checkboxId: data.checkboxId
      });
    }
  }
});
