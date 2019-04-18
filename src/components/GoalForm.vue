<template>
  <transition v-if="show" name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h1 class="modal-title">New {{ goalTypeName }} Goal</h1>
          </div>
          <div class="modal-body">
            <p v-if="error" class="error">{{ error }}</p>
            <form @submit.prevent="upload" class="pure-form">
              <input v-model="title" placeholder="Title" />

              <textarea v-model="description" placeholder="Description">
              </textarea>
              <p></p>
              <div v-if="!goalType">
                <div class="flex-row">
                  <label>Type of goal</label>
                  <select id="type" v-model="type" class="pure-input">
                    <option value="daily">
                      Daily
                    </option>
                    <option value="weekly">
                      Weekly
                    </option>
                    <option value="monthly">
                      Monthly
                    </option>
                    <option value="long">
                      Long term
                    </option>
                  </select>
                  <button
                    type="button"
                    v-on:click="addTask"
                    class="button-small pure-button pure-button-primary"
                  >
                    <i class="fa fa-plus"></i>
                    Add Task
                  </button>
                </div>
              </div>
              <div v-else>
                <button
                  type="button"
                  v-on:click="addTask"
                  class="button-small pure-button pure-button-primary"
                >
                  <i class="fa fa-plus"></i>
                  Add Task
                </button>
              </div>

              <p></p>
              <div
                v-for="(task, index) in taskArray"
                v-bind:key="task.key"
                class="tasks"
              >
                <div class="flex-row task">
                  <span> {{ index + 1 }}. </span>
                  <input v-model="tasks[task.key].value" />
                  <a v-on:click="removeTask(task.key)">
                    <i class="fas fa-trash"></i>
                  </a>
                </div>
              </div>

              <p></p>

              <p></p>
              <button type="button" @click="close" class="pure-button">
                Close
              </button>
              <button type="submit" class="pure-button pure-button-secondary">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
const goalTypeNames = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  long: "Long Term"
};
export default {
  name: "Uploader",
  props: ["show"],
  data() {
    return {
      title: "",
      type: "",
      description: "",
      error: "",
      tasks: {}
    };
  },
  computed: {
    taskArray() {
      return Object.values(this.tasks);
    },
    goalType() {
      const type = this.$store.state.currentGoalFormType
      if (typeof type !== "string") return null
      return this.$store.state.currentGoalFormType;
    },
    goalTypeName() {
      const type = this.$store.state.currentGoalFormType;
      return goalTypeNames[type];
    }
  },
  methods: {
    close() {
      this.title = "";
      this.description = "";
      this.tasks = {};
      this.type = "";
      this.$emit("escape");
    },
    addTask() {
      const largestId = Object.keys(this.tasks).reduce((largest, key) => {
        let kInt = parseInt(key);
        if (kInt > largest) return kInt;
      }, 0);
      const newTasks = { ...this.tasks };
      const key = `${largestId + 1}-id`;
      newTasks[key] = { key: key, value: "" };
      this.tasks = newTasks;
    },
    removeTask(taskId) {
      const newTasks = { ...this.tasks };
      delete newTasks[taskId];
      this.tasks = { ...newTasks };
    },
    async upload() {
      try {
        const data = {
          title: this.title,
          description: this.description,
          type: this.goalType || this.type,
          checklist: this.tasks
        };
        this.error = await this.$store.dispatch("addGoal", data);
        if (!this.error) {
          this.title = "";
          this.description = "";
          this.tasks = {};
          this.type = "";
          this.$emit("formFinished");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style scoped>
input {
  width: 100%;
}

.task svg {
  color: red;
  padding: 6px 0px 6px 6px;
}

.task span {
  padding: 6px 6px 6px 0px;
}
.task input {
  margin-bottom: 6px;
}

.button-small {
  font-size: 85%;
}

label {
  margin-right: 8px;
}

.flex-row {
  display: flex;
  justify-content: space-between;
}

textarea {
  width: 100%;
  height: 100px;
}

.pure-button-secondary {
  float: right;
}
</style>
