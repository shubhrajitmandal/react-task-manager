const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Task = require("../models/Task");
const verify = require("../middleware/verifyToken");

router.post("/", async (req, res) => {
  const { name, email, username, password } = req.body;

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists)
    return res.status(400).json({ msg: "Email already exists!" });

  const usernameExists = await User.findOne({ username: req.body.username });
  if (usernameExists)
    return res.status(400).json({ msg: "Username already exists!" });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    username,
    password: hashedPassword,
  });

  try {
    const newUser = await user.save();
    const token = jwt.sign({ _id: newUser._id }, process.env.TOKEN_SECRET, {
      expiresIn: 60 * 60,
    });
    res.json({ token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.get("/", verify, async (req, res) => {
  // console.log(req.user._id);
  try {
    const user = await User.findById({ _id: req.user._id }).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error!" });
  }
});

// router.put("/:id", verify, async (req, res) => {
//   if (req.user._id !== req.params.id)
//     return res.status(401).json({ msg: "Unauthorised!" });

//   const user = await User.findOne({ _id: req.params.id });
//   if (!user) return res.status(400).json({ msg: "User doesn't exist!" });

//   const { name, password } = req.body;

//   user.name = name ? name : user.name;

//   try {
//     const newUser = await user.save();
//     res.json(newUser);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "Server Error!" });
//   }
// });

router.delete("/:id", verify, async (req, res) => {
  if (req.user._id !== req.params.id)
    return res.status(401).json({ msg: "Unauthorised!" });

  try {
    await User.deleteOne({ _id: req.params._id });
    res.json({ msg: "User Deleted!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error!" });
  }
});

module.exports = router;
