const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.json({ message: "User exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed
  });

  res.json(user);
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ message: "Wrong password" });

  res.json(user);
});

module.exports = router;