const express = require("express");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Customer = require("../models/customerModel");
const validateToken = require("../middleware/validateToken");

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newCustomer = new Customer({
      username: username,
      password: hashedPassword,
    });
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const customer = await Customer.findOne({ username });
    if (!customer) {
      return res.status(404).json({ message: "user Not Found" });
    }
    const match = await bcrypt.compare(password, customer.password);
    if (!match) {
      return res.status(200).json({
        message: "Password incorrect",
        customer,
      });
    }
    const accessToken = jwt.sign(
      {
        user: {
          id: customer._id,
          username: customer.username,
        },
      },
      process.env.API_SECRETE_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.get("/", validateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json({ message: "User Found", user: req.user }); // Corrected to return 200 OK
  } catch (err) {
    res.status(500).json({ message: "Cant get User" });
  }
});
module.exports = router;
