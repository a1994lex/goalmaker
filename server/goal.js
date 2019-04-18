const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const auth = require("./auth.js");
const users = require("./users.js");
const User = users.model;

const goalSchema = new mongoose.Schema({
  title: String,
  description: String,
  checklist: [
    {
      done: Boolean,
      text: String
    }
  ],
  done: Date,
  created: {
    type: Date,
    default: Date.now
  },
  type: String, // WEEK, DAY, MONTH, LONG
  team: {
    type: mongoose.Schema.ObjectId,
    ref: "Team"
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }
});

const Goal = mongoose.model("Goal", goalSchema);

router.get("/", auth.verifyToken, User.verify, async (req, res) => {
  try {
    const goals = await Goal.find({
      $or: [{ owner: req.user }, { collaborators: req.user }]
    }).sort({
      created: -1
    });
    return res.send(goals);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

router.post("/", auth.verifyToken, User.verify, async (req, res) => {
  console.log("posting");
  try {
    const data = req.body;
    if (!req.body) return res.sendStatus(400);
    const list = [];
    if (data.checklist) {
      Object.values(data.checklist).forEach(c => {
        list.push({ text: c.value, done: false, order: c.key });
      });
    }
    const team = data.team; // TODO: set up team schema
    const goal = new Goal({
      title: data.title,
      description: data.description,
      checklist: list,
      done: null,
      type: data.type,
      team: team,
      owner: req.user
    });
    await goal.save();
    return res.send(goal);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

router.put("/:id", auth.verifyToken, User.verify, async (req, res) => {
  console.log("updating");
  console.log(req.body);
  const id = req.params.id;
  try {
    const goal = await Goal.findOne({ _id: id });
    if (req.body.checkboxId) {
      const itemIndex = goal.checklist.findIndex(i => {
        console.log(`${i._id} === ${req.body.checkboxId}`);
        return i._id == req.body.checkboxId;
      });
      console.log(`item index ${itemIndex}`);
      if (itemIndex > -1) {
        goal.checklist[itemIndex].done = !goal.checklist[itemIndex].done;
        console.log(goal.checklist[itemIndex]);
      }
    }
    if (req.body.title) {
      goal.title = req.body.title;
    }
    if (req.body.checklist) {
      goal.checklist = req.body.checklist;
    }
    if (req.body.description) {
      goal.description = req.body.description;
    }
    if (req.body.done) {
      goal.done = Date.now();
    }
    await goal.save();
    // console.log(goal);
    return res.send(goal);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

router.delete("/:id", auth.verifyToken, User.verify, async (req, res) => {
  console.log("deleting");
  const id = req.params.id;
  try {
    await Goal.remove({ _id: id }).exec();
    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

module.exports = {
  routes: router,
  model: Goal
};
