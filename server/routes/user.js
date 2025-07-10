const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.get('/getUsers', async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(401).send({ message: err.message });
  }
});


router.post('/login', async (req, res) => {
  console.log("Login request received:", req.body);  // Log the incoming request data
  try {
      const user = await User.login(req.body);
      res.send({...user, password: undefined});
  } catch (err) {
      console.error("Login Error:", err.message);  // Log the error message
      res.status(401).send({message: err.message});
  }
});

router.post("/register", async (req, res) => {
  try {
    console.log("Received body:", req.body); 
    const newUser = await User.register(req.body);
    res.send(newUser);
  } catch (err) {
    console.error("Register Error:", err.message); 
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;