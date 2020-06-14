const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  const user = await User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  });
  if (!user) return res.status(400).json({ msg: "Invalid Username!" });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).json({ msg: "Invalid Password!" });

  const { _id, name, email, username, created, _v } = user;

  const token = jwt.sign({ _id }, process.env.TOKEN_SECRET, {
    expiresIn: 60 * 60,
  });
  res.json({ token });
});

module.exports = router;
