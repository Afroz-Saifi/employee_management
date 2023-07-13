const express = require("express");
const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

// register a new user
userRouter.post("/signup", async (req, res) => {
  try {
    const payload = req.body;
    const { password } = payload;
    const hash = bcrypt.hashSync(password, 8);
    const data = new User({ ...payload, password: hash });
    await data.save();
    return res.status(201).json({
      error: false,
      message: "Signup successful",
      user: data,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.message,
    });
  }
});

// user login
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });
    if (!userData) {
      throw new Error("User not found. Please register first !");
      return;
    }
    const passCheck = bcrypt.compareSync(password, userData.password);
    if (!passCheck) {
      throw new Error("Password not correct !");
      return;
    }
    const payload = {
      email,
      id: userData._id,
    };
    const token = jwt.sign(payload, process.env.access_token, {
      expiresIn: "1h",
    });
    return res.status(201).json({
        error: false,
        message: "Login successfull",
        token
    })
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.message,
    });
  }
});

module.exports = { userRouter };
