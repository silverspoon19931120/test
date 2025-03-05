const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();
const SECRET = process.env.JWT_SECRET;

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username !== "admin" || password !== "password123") {
    return res.status(403).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });

  res.json({ token });
});

module.exports = router;
