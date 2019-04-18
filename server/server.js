const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

const mongoose = require("mongoose");

// connect to the database
mongoose.connect("mongodb://localhost:27017/goalmaker", {
  useNewUrlParser: true
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const users = require("./users.js");
app.use("/api/users", users.routes);

const goals = require("./goal.js");
app.use("/api/goals", goals.routes);

app.listen(3004, () => console.log("Server listening on port 3004!"));
