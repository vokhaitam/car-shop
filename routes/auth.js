const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { createUser, findUserByEmail } = require("../models/userModels");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, fullname, phone, address } = req.body;
  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(
      email,
      hashedPassword,
      fullname,
      phone,
      address,
    );
    res.json({ success: true, userId: newUser.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/Login page/Login.html");
  });
});

module.exports = router;
