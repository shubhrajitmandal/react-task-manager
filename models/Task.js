const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  done: {
    type: Boolean,
    required: true,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Task", taskSchema, "Tasks");
