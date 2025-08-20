const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.get("/getUsers", async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    // expects { username, password }
    const dbUser = await User.login(req.body);
    // Return only what FE needs
    const { UserID, Username } = dbUser;
    res.status(200).json({ UserID, Username });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(401).json({ message: err.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const newUser = await User.register(req.body);
    res.status(201).json(newUser); 
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// delete single user
router.delete("/:id", async (req, res) => {
  try {
    const result = await User.deleteUser(req.params.id);
    res.json(result);
  } catch (err) {
    console.error("Delete User Error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// delete all users
router.delete("/", async (req, res) => {
  try {
    const result = await User.deleteAllUsers();
    res.json(result);
  } catch (err) {
    console.error("Delete All Users Error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
