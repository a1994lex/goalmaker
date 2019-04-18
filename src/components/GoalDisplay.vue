<template>
  <div class="goal-display">
    <div class="goal-head">
      <a @click="toggleDetail" class="detail" v-if="showDetail">
        <i class="fas fa-angle-up"></i>
      </a>
      <a @click="toggleDetail" class="detail" v-else-if="!showDetail">
        <i class="fas fa-angle-down"></i>
      </a>
      <input
        v-model="goal.title"
        placeholder="Title"
        v-bind:disabled="!editMode"
      />
      <a @click="doDelete" class="trash"><i class="fa fa-trash"></i></a>
    </div>
    <div v-show="showDetail" class="details">
      <div class="flex-row">
        <a @click="toggleEdit" class="edit"
          ><i class="fa fa-edit"></i
          >{{ editMode === false ? "Edit" : "Editing" }}</a
        >
        <div class="date">Created {{ formatDate(goal.created) }}</div>
      </div>
      <div v-if="editMode">
        <textarea class="description" v-model="description"> </textarea>
      </div>
      <div v-else>
        <textarea
          class="description"
          disabled
          v-model="goal.description"
        ></textarea>
      </div>
      <p></p>
      <div v-if="editMode">
        <div
          v-for="(task, index) in taskArray"
          v-bind:key="task._id"
          class="tasks"
        >
          <div class="flex-row task">
            <span> {{ index + 1 }}. </span>
            <input v-model="tasks[task._id].text" />
            <a v-on:click="removeTask(task._id)">
              <i class="fas fa-times"></i>
            </a>
          </div>
        </div>
        <div class="flex-row">
          <button
            type="button"
            v-on:click="addTask"
            class="button-xsmall pure-button pure-button-primary"
          >
            <i class="fa fa-plus"></i>
            Add Task
          </button>
          <button
            type="button"
            v-on:click="submitUpdate"
            class="button-xsmall pure-button save-change-btn"
          >
            Save Changes
          </button>
        </div>
      </div>
      <div v-else class="checklist">
        <div
          v-for="item in tasks"
          v-bind:key="item._id"
          :class="{ 'item-crossed-out': item.done === true }"
        >
          <input
            type="checkbox"
            v-model="item.done"
            v-on:click="check(item._id)"
          />
          {{ item.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate as _formatDate } from "@/helpers/functions.js";
export default {
  name: "GoalDisplay",
  props: ["goal"],
  data() {
    const tasks = {};
    this.goal.checklist.forEach(t => {
      tasks[t._id] = { _id: t._id, text: t.text, done: t.done };
    });
    return {
      editMode: false,
      showDetail: false,
      title: this.goal.title,
      description: this.goal.description,
      tasks: tasks
    };
  },
  computed: {
    taskArray() {
      return Object.values(this.tasks);
    }
  },
  methods: {
    toggleEdit() {
      if (this.editMode) {
        this.reset(false);
      } else {
        this.reset(true);
      }
    },
    toggleDetail() {
      this.showDetail = !this.showDetail;
      if (this.showDetail === false) {
        this.reset(false);
      }
    },
    reset(mode) {
      this.editMode = mode;
      this.description = this.goal.description;
      this.title = this.goal.title;
      const tasks = {};
      this.goal.checklist.forEach(t => {
        tasks[t._id] = { _id: t._id, text: t.text, done: t.done };
      });
      this.tasks = tasks;
    },
    async doDelete() {
      await this.$store.dispatch("deleteGoal", this.goal._id);
      // await this.$store.dispatch("getGoals")
    },
    addTask() {
      const largestId = Object.keys(this.tasks).reduce((largest, key) => {
        let kInt = parseInt(key);
        if (kInt > largest) return kInt;
      }, 0);
      const newTasks = { ...this.tasks };
      const key = `${largestId + 1}-id`;
      newTasks[key] = { _id: key, text: "", done: false };
      this.tasks = newTasks;
      console.log(this.tasks);
    },
    removeTask(taskId) {
      const newTasks = { ...this.tasks };
      delete newTasks[taskId];
      this.tasks = { ...newTasks };
    },
    formatDate(date) {
      return _formatDate(date);
    },
    async submitUpdate() {
      await this.$store.dispatch("updateGoal", {
        title: this.title,
        description: this.description,
        checklist: this.taskArray,
        id: this.goal._id
      });
      this.reset(false);
    },
    async check(id) {
      await this.$store.dispatch("checkOff", {
        checkboxId: id,
        goalId: this.goal._id
      });
    }
  },
  created() {
    console.log(this.tasks);
  }
};
</script>

<style scoped>
.goal-display {
  margin: 8px 0px;
  position: relative;
}
.checklist {
}
.trash svg {
  color: #f2462c;
}
.edit svg {
  color: #3d4759;
}
a {
  padding: 4px;
  cursor: pointer;
}
a:hover {
  opacity: 0.6;
}
.goal-head {
  display: flex;
}
.goal-head input {
  background: transparent;
  border: none;
  width: 80%;
  border-bottom: 1px solid black;
}
.checklist input {
  border-bottom: 1px solid black;
}

.flex-row {
  display: flex;
  justify-content: space-between;
}
.date {
  font-size: 0.7rem;
  font-style: italic;
  padding: 8px 0;
}
.details {
  padding: 8px 16px;
  border-bottom: 1px solid #ccc;
}
.description {
  font-size: 0.8rem;
  width: 100%;
  background-color: transparent;
}
.button-xsmall {
  font-size: 0.8rem;
}
.save-change-btn {
  background-color: #2fcc84;
  color: white;
}

.item-crossed-out {
  text-decoration: line-through;
  color: green;
}

.task svg {
  color: red;
  padding: 6px 0px 6px 6px;
}

.task span {
  padding: 6px 6px 6px 0px;
}
.task input {
  width: 80%;
  margin-bottom: 6px;
}

.tasks span {
  font-size: 0.8rem;
}
</style>
