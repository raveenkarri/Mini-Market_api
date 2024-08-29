const Shop = require("../models/ShopModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const addShop = async (req, res) => {
  try {
    const { username, password, areaname, category, shopname, shopImage } =
      req.body;
    if (!username || !password || !areaname || !category || !shopname) {
      return res.status(400).json({ message: "All fields are mandatory!" });
    }
    let user = await Shop.findOne({ username });
    if (user) {
      return res.json({
        message:
          "This User name already Registered...please try another user name!",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newShop = await Shop.create({
      username,
      password: hashedPassword,
      areaname: areaname.toUpperCase(),
      category: category.toUpperCase(),
      shopname,
      shopImage,
    });

    res.status(201).json({ newShop });
  } catch (error) {
    console.error("Error saving Shop:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
const loginShop = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are mandatory!" });
    }

    let user = await Shop.findOne({ username });
    if (!user) {
      return res.status(404).json({
        message: "User Not Found!",
      });
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(401).json({ message: "Password Mismatched" });
    }
    const accessToken = jwt.sign(
      {
        userShop: {
          id: user._id,
          name: user.username,
          shop: user.shopname,
        },
      },
      process.env.API_SECRETE_KEY,
      { expiresIn: "7d" }
    );
    res.status(200).json({
      message: "Login Successful!",
      userName: user.username,
      token: accessToken,
    });
  } catch (error) {
    console.error("Error logging Shop:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getAllShops = async (req, res) => {
  try {
    const Shops = await Shop.find();
    if (!Shops) {
      return res.status(404).json({ message: "Shops not found!" });
    }
    res.status(200).json({ Shops });
  } catch (error) {
    console.error("Error fetching Shops:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
const getShop = async (req, res) => {
  try {
    const shopid = req.userShop.id;
    if (!shopid) {
      return res.status(400).json({ message: "Shop ID is required" });
    }

    const shop = await Shop.findOne({ _id: shopid }, "-password");
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    res.status(200).json({ shop });
  } catch (error) {
    console.error("Error fetching Shop:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getShopByAreaname = async (req, res) => {
  try {
    const { area, category, shopname } = req.params;
    let query = {};
    if (area) query.areaname = area;
    if (category) query.category = category;
    if (shopname) query.shopname = shopname;

    const shops = await Shop.find(query);
    if (!shops) return res.status(404).json({ message: "No shops found" });
    res.status(200).json({ shops });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addShop,
  loginShop,
  getAllShops,
  getShop,
  getShopByAreaname,
};
