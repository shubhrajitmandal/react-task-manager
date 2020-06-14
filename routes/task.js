const router = require("express").Router();
const User = require("../models/User");
const Task = require("../models/Task");
const verify = require("../middleware/verifyToken");

router.get("/", verify, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error!" });
  }
});

router.post("/add", verify, async (req, res) => {
  const task = new Task({
    todo: req.body.todo,
    user: req.user._id,
    done: false,
  });

  try {
    await task.save();
    res.json({ msg: "Task Added!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error!" });
  }
});

router.put("/:id", verify, async (req, res) => {
  // console.log(req.body);
  const task = await Task.findById({ _id: req.params.id });

  const { todo, done } = req.body;

  task.todo = todo ? todo : task.todo;

  if (typeof done !== "undefined") {
    task.done = done;
  }

  try {
    await task.save();
    res.json({ msg: "Task Updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error!" });
  }
});

router.delete("/:id", verify, async (req, res) => {
  try {
    await Task.deleteOne({ _id: req.params.id });
    res.json({ msg: "Task Deleted!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error!" });
  }
});

module.exports = router;
