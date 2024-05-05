const express = require("express");
const router = express.Router();
const userModels = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/userRegister", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const salt = await bcrypt.genSalt(10);
    const genPassword = await bcrypt.hash(password, salt);

    const existingUser = await userModels.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email Already Registered", status: false });
    }

    const userData = new userModels({ email, password: genPassword, name });
    await userData.save();

    res
      .status(200)
      .json({ message: "Account Created Successfully!", status: true });
  } catch (error) {
    console.error("Error in user registration:", error);
    res.status(500).json({ message: "Internal Server Error", status: false });
  }
});

router.post("/userLogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModels.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Email not found", status: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", status: false });
    }

    //imp section
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn:"1h"
    });
    res
      .status(200)
      .json({ message: "Login Successful", status: true, authToken: token });
  } catch (error) {
    console.error("Error in user login:", error);
    res.status(500).json({ message: "Internal Server Error", status: false });
  }
});

module.exports = router;
