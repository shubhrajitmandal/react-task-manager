const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) return res.status(401).json({ msg: "Unauthorised!" });

  try {
    const verifiedUser = await jwt.verify(token, process.env.TOKEN_SECRET);
    if (!verifiedUser) return res.status(401).json({ msg: "Unauthorised!" });

    req.user = verifiedUser;
    // console.log(req.user);
    next();
  } catch (err) {
    res.status(400).json(err);
  }
};
