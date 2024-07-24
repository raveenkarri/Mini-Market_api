const express = require("express");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const router = express.Router();
const Customer = require("../models/customerModel");

router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newCustomer = new Customer({
      username: req.body.username,
      password: hashedPassword,
    });
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const savedCustomer = await Customer.find();
    res.status(201).json({ savedCustomer });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const customer = await Customer.findOne({ username: req.body.username });
    if (customer) {
      const match = await bcrypt.compare(req.body.password, customer.password);
      if (match) {
        res
          .status(200)
          .json({ message: "Authentication successful", customer });
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = router;
