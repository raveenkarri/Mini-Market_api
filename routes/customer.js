const express = require("express");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
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
    res.cookie("token", accessToken, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day expiration
      httpOnly: true, // Ensures the cookie is only accessible by the web server
      secure: process.env.NODE_ENV === "production", // Cookie sent only over HTTPS in production
      sameSite: "Lax", // Protect against CSRF
    });

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

router.post("/cartItems", validateToken, async (req, res) => {
  try {
    const { cartProducts } = req.body;
    const id = req.user.id;
    console.log(cartProducts);
    const customer = await Customer.findById(id);
    if (!customer) {
      res.json({ message: "Customer not found" });
    }

    customer.cartProducts.push(...cartProducts);

    await customer.save();

    res.json({ message: "item added to cart" });
  } catch (error) {
    if (error) {
      res.json({ message: "Error while posting item" });
    }
  }
});
router.get("/getItems", validateToken, async (req, res) => {
  try {
    const id = req.user.id;

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.json({ message: "Customer not found" });
    }
    const cartitems = customer.cartProducts;

    res.json({ cartProducts: cartitems, user: req.user });
  } catch (error) {
    if (error) {
      res.json({ message: "Error while posting item" });
    }
  }
});
router.delete("/delete/:id", validateToken, async (req, res) => {
  try {
    const deleteId = req.params.id;
    const userid = req.user.id;
    const customer = await Customer.findByIdAndUpdate(
      userid,
      {
        $pull: { cartProducts: { _id: deleteId } },
      },
      { new: true }
    );
    if (!customer) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Deleted Successfully" });
  } catch (error) {
    res.json({ message: "item not deleted" });
  }
});

module.exports = router;
